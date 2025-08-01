from rest_framework.generics import (
    CreateAPIView,
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
    ListAPIView,
    RetrieveAPIView,
    DestroyAPIView,

)
from django.contrib.auth.models import User
from .serializers import (
    RegisterSerializer,
    MyTokenObtainPairSerializer,
    DonationCategorySerializer,
    DonationCampaignSerializer,
    DonationSerializer,
    TeamSerializer,
    ContactSerializer,
    CartSerializer,
    CartReadSerializer,
)
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import filters,generics, permissions
from .models import DonationCategory, DonationCampaign, Donation, Team,Contact,Cart
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import BasePermission, SAFE_METHODS,AllowAny,IsAuthenticated

class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        # Safe methods: GET, HEAD, OPTIONS are allowed for everyone
        if request.method in SAFE_METHODS:
            return True
        # Only admins can POST, PUT, DELETE
        return request.user and request.user.is_staff

# ✅ Auth
class RegisterView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# ✅ Categories
class DonationCategoryListCreateAPIView(ListCreateAPIView):
    queryset = DonationCategory.objects.all()
    serializer_class = DonationCategorySerializer
    permission_classes = [IsAdminOrReadOnly]


# ✅ Campaigns
class DonationCampaignListCreateAPIView(ListCreateAPIView):
    queryset = DonationCampaign.objects.all()
    serializer_class = DonationCampaignSerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['title']
    filterset_fields = ['category', 'category__name']
    permission_classes = [IsAdminOrReadOnly]

class DonationCampaignDetailAPIView(RetrieveUpdateDestroyAPIView):
    queryset = DonationCampaign.objects.all()
    serializer_class = DonationCampaignSerializer
    lookup_field = 'id'
    permission_classes = [IsAdminOrReadOnly]

# ✅ Donations
class DonationListCreateAPIView(ListCreateAPIView):
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer
    permission_classes = [IsAuthenticated]

class DonationDetailAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer
    lookup_field = 'id'
    permission_classes = [IsAdminOrReadOnly]

class TeamListCreateAPIView(ListCreateAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [IsAdminOrReadOnly]

class TeamDetailAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    lookup_field = 'id'
    permission_classes = [IsAdminOrReadOnly] 


# Already available for public
class ContactCreateAPIView(CreateAPIView):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [AllowAny]

# Admin-only: view list of all contacts
class ContactListAPIView(ListAPIView):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [IsAdminOrReadOnly]  

# Admin-only: view single contact message
class ContactDetailAPIView(RetrieveAPIView):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'id'

# Optional: delete message if spam or junk
class ContactDeleteAPIView(DestroyAPIView):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'id'

from rest_framework.response import Response
from rest_framework import status

class CartListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.request.method == "POST":
            return CartSerializer
        return CartReadSerializer

    def perform_create(self, serializer):
        user = self.request.user
        campaign = serializer.validated_data.get('campaign')

        if Cart.objects.filter(user=user, campaign=campaign).exists():
            raise ValidationError("Campaign already in cart.")

        serializer.save(user=user)


class CartDeleteAPIView(generics.DestroyAPIView):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]
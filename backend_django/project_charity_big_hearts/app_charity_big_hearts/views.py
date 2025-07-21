from rest_framework.generics import (
    CreateAPIView,
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from django.contrib.auth.models import User
from .serializers import (
    RegisterSerializer,
    MyTokenObtainPairSerializer,
    DonationCategorySerializer,
    DonationCampaignSerializer,
    DonationSerializer,
)
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import filters
from .models import DonationCategory, DonationCampaign, Donation
from django_filters.rest_framework import DjangoFilterBackend


from rest_framework.permissions import BasePermission, SAFE_METHODS

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
    filterset_fields = ['category__name']
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
    permission_classes = [IsAdminOrReadOnly]

class DonationDetailAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer
    lookup_field = 'id'
    permission_classes = [IsAdminOrReadOnly]
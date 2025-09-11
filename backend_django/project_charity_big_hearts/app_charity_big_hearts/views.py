from rest_framework.generics import (
    CreateAPIView,
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
    ListAPIView,
    RetrieveAPIView,
    DestroyAPIView,
RetrieveUpdateAPIView,
)

from rest_framework.views import APIView
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
    DonationCreateSerializer,
    UserProfileSerializer, 
    ChangePasswordSerializer,
    AdminUserSerializer,
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
        donation_amount = serializer.validated_data.get('donation_amount')

        # ✅ Check if item already exists
        existing_cart_item = Cart.objects.filter(user=user, campaign=campaign).first()
        
        if existing_cart_item:
            # Update the donation amount instead of raising an error
            existing_cart_item.donation_amount = donation_amount
            existing_cart_item.save()
            return existing_cart_item
        
        # Create new cart item
        serializer.save(user=user)

class CartDeleteAPIView(generics.DestroyAPIView):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

class DonationCreateAPIView(CreateAPIView):
    queryset = Donation.objects.all()
    serializer_class = DonationCreateSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            
            # Save the donation
            donation = serializer.save()
            
            return Response({
                'message': 'Donation submitted successfully!',
                'donation_id': donation.id,
                'amount': str(donation.donation_amount),
                'campaign': donation.campaign.title
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({
                'error': 'Failed to process donation. Please try again.',
                'details': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
        

class UserProfileView(RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        try:
            response = super().update(request, *args, **kwargs)
            return Response({
                'message': 'Profile updated successfully!',
                'user': response.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'error': 'Failed to update profile.',
                'details': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        try:
            serializer = ChangePasswordSerializer(
                data=request.data, 
                context={'request': request}
            )
            
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'message': 'Password changed successfully!'
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': 'Password change failed.',
                    'details': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            return Response({
                'error': 'Failed to change password.',
                'details': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

class AdminUserListView(ListAPIView):
    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdminOrReadOnly]  # only admins can access
    pagination_class = None

class AdminUserDeleteView(DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = "pk"
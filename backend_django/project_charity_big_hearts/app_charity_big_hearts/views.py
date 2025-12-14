from rest_framework.generics import (
    CreateAPIView,  # Allows only POST (create) operations
    ListCreateAPIView,  # Allows both GET (list) and POST (create)
    RetrieveUpdateDestroyAPIView,  # Full CRUD for ONE object: GET, PUT, PATCH, DELETE
    ListAPIView,  # List ALL objects, supports GET only
    RetrieveAPIView,  # Get ONE single object, supports GET only
    DestroyAPIView,  # Delete ONE object, supports DELETE only
    RetrieveUpdateAPIView,  # Get ONE object + update it, supports GET, PUT, PATCH
)

# PUT replaces the entire object with the data you send
# PATCH updates only the fields you send (partial update)

from rest_framework.views import APIView  # Base class for creating custom API views
from django.contrib.auth.models import User  # Django's built-in User model

# Importing all serializers used in this views file
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

from rest_framework_simplejwt.views import TokenObtainPairView  # JWT login view
from rest_framework import filters, generics, permissions  # DRF utilities
from .models import DonationCategory, DonationCampaign, Donation, Team, Contact, Cart  # Project models
from django_filters.rest_framework import DjangoFilterBackend  # Filtering support
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import BasePermission, SAFE_METHODS, AllowAny, IsAuthenticated


# -------------------- Custom Permission --------------------
class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        # SAFE_METHODS = GET, HEAD, OPTIONS (read-only requests)
        if request.method in SAFE_METHODS:
            return True
        # Only admin users can create, update, or delete
        return request.user and request.user.is_staff


# -------------------- Authentication --------------------
class RegisterView(CreateAPIView):
    # API for user registration
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


class MyTokenObtainPairView(TokenObtainPairView):
    # Custom JWT login view (username/email + password)
    serializer_class = MyTokenObtainPairSerializer


# -------------------- Donation Categories --------------------
class DonationCategoryListCreateAPIView(ListCreateAPIView):
    # GET all categories | POST new category (admin only)
    queryset = DonationCategory.objects.all()
    serializer_class = DonationCategorySerializer
    permission_classes = [IsAdminOrReadOnly]


class DonationCategoryDetailAPIView(RetrieveUpdateDestroyAPIView):
    # GET, UPDATE, DELETE a single category by ID
    queryset = DonationCategory.objects.all()
    serializer_class = DonationCategorySerializer
    lookup_field = "id"  # Field used to identify object
    permission_classes = [IsAdminOrReadOnly]


# -------------------- Donation Campaigns --------------------
class DonationCampaignListCreateAPIView(ListCreateAPIView):
    # GET all campaigns | POST new campaign (admin only)
    queryset = DonationCampaign.objects.all()
    serializer_class = DonationCampaignSerializer

    # Enables search and filtering
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['title']  # Search by campaign title
    filterset_fields = ['category', 'category__name']  # Filter by category ID or name

    permission_classes = [IsAdminOrReadOnly]


class DonationCampaignDetailAPIView(RetrieveUpdateDestroyAPIView):
    # GET, UPDATE, DELETE single campaign
    queryset = DonationCampaign.objects.all()
    serializer_class = DonationCampaignSerializer
    lookup_field = 'id'
    permission_classes = [IsAdminOrReadOnly]

    def update(self, request, *args, **kwargs):
        # Allow partial updates even when using PUT
        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)


# -------------------- Donations --------------------
class DonationListCreateAPIView(ListCreateAPIView):
    # Authenticated users can view and create donations
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None  # Disable pagination


class DonationDetailAPIView(RetrieveUpdateDestroyAPIView):
    # Admin can manage individual donations
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer
    lookup_field = 'id'
    permission_classes = [IsAdminOrReadOnly]


# -------------------- Team --------------------
class TeamListCreateAPIView(ListCreateAPIView):
    # GET team members | POST new member (admin only)
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = None


class TeamDetailAPIView(RetrieveUpdateDestroyAPIView):
    # Manage individual team member
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    lookup_field = 'id'
    permission_classes = [IsAdminOrReadOnly] 

    def update(self, request, *args, **kwargs):
        # Allow partial updates
        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)


# -------------------- Contact --------------------
class ContactCreateAPIView(CreateAPIView):
    # Public contact form submission
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [AllowAny]


class ContactListAPIView(ListAPIView):
    # Admin-only view of all contact messages
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [IsAdminOrReadOnly]


class ContactDetailAPIView(RetrieveAPIView):
    # Admin-only view of a single contact message
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'id'


class ContactDeleteAPIView(DestroyAPIView):
    # Admin-only delete contact message
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'id'


from rest_framework.response import Response
from rest_framework import status


# -------------------- Cart --------------------
class CartListCreateAPIView(generics.ListCreateAPIView):
    # Authenticated user can view and add cart items
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return only cart items of logged-in user
        return Cart.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        # Use different serializer for POST and GET
        if self.request.method == "POST":
            return CartSerializer
        return CartReadSerializer

    def perform_create(self, serializer):
        user = self.request.user
        campaign = serializer.validated_data.get('campaign')
        donation_amount = serializer.validated_data.get('donation_amount')

        # Check if campaign already exists in cart
        existing_cart_item = Cart.objects.filter(user=user, campaign=campaign).first()
        
        if existing_cart_item:
            # Update donation amount instead of creating duplicate
            existing_cart_item.donation_amount = donation_amount
            existing_cart_item.save()
            return existing_cart_item
        
        # Create new cart item
        serializer.save(user=user)


class CartDeleteAPIView(generics.DestroyAPIView):
    # Delete a cart item
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]


# -------------------- Donation Creation --------------------
class DonationCreateAPIView(CreateAPIView):
    # Create donation and update campaign amount
    queryset = Donation.objects.all()
    serializer_class = DonationCreateSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            # Save donation
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


# -------------------- User Profile --------------------
class UserProfileView(RetrieveUpdateAPIView):
    # View and update logged-in user's profile
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Always return current logged-in user
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


# -------------------- Change Password --------------------
class ChangePasswordView(APIView):
    # Allows logged-in user to change password
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


# -------------------- Admin Users --------------------
class AdminUserListView(ListAPIView):
    # Admin-only list of all users
    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = None


class AdminUserDeleteView(DestroyAPIView):
    # Admin-only delete user
    queryset = User.objects.all()
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = "pk"  # pk is shortcut for primary key (id)


# -------------------- Admin Campaign List --------------------
class DonationCampaignAdminListAPIView(ListAPIView):
    # Admin-only list of all donation campaigns
    queryset = DonationCampaign.objects.all()
    serializer_class = DonationCampaignSerializer
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = None  # Disable pagination

from django.urls import path
from .views import (
    CartDeleteAPIView, RegisterView, MyTokenObtainPairView,
    DonationCategoryListCreateAPIView,
    DonationCampaignListCreateAPIView,
    DonationCampaignDetailAPIView,
    DonationListCreateAPIView,
    DonationDetailAPIView,
    TeamListCreateAPIView, 
    TeamDetailAPIView,
    ContactCreateAPIView,
    ContactListAPIView,
    ContactDetailAPIView,
    ContactDeleteAPIView,
    CartListCreateAPIView,
    CartDeleteAPIView,
    DonationCreateAPIView,
    UserProfileView,
    ChangePasswordView,
    AdminUserListView,
    AdminUserDeleteView,
    DonationCategoryDetailAPIView,
    DonationCampaignAdminListAPIView,
)

from rest_framework_simplejwt.views import TokenRefreshView, TokenBlacklistView

urlpatterns = [
    # 🔐 Auth
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', MyTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', TokenBlacklistView.as_view(), name='logout'),

    #  API Endpoints
    path('categories/', DonationCategoryListCreateAPIView.as_view(), name='category-list'),
    path('categories/<int:id>/', DonationCategoryDetailAPIView.as_view(), name='category-detail'),

    # public campaigns with pagination
    path('donations/', DonationCampaignListCreateAPIView.as_view(), name='donation-list'),
    path('donations/<int:id>/', DonationCampaignDetailAPIView.as_view(), name='donation-detail'),
    path('donate/', DonationListCreateAPIView.as_view(), name='donate-list'),
    path('donate/<int:id>/', DonationDetailAPIView.as_view(), name='donate-detail'),

    path('team/', TeamListCreateAPIView.as_view(), name='team-list'),
    path('team/<int:id>/', TeamDetailAPIView.as_view(), name='team-detail'),

    path('contact/', ContactCreateAPIView.as_view(), name='contact-create'),
    path('admin/contact/', ContactListAPIView.as_view(), name='contact-list'),
    path('admin/contact/<int:id>/', ContactDetailAPIView.as_view(), name='contact-detail'),
    path('admin/contact/<int:id>/delete/', ContactDeleteAPIView.as_view(), name='contact-delete'),

    path('cart/', CartListCreateAPIView.as_view(), name='cart-list-create'),
    path('cart/<int:pk>/', CartDeleteAPIView.as_view(), name='cart-delete'),

    path('donate/submit/', DonationCreateAPIView.as_view(), name='donation-create'),

    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('profile/change-password/', ChangePasswordView.as_view(), name='change-password'),

    path('admin/users/', AdminUserListView.as_view(), name='admin-users'),
    path('admin/users/<int:pk>/delete/', AdminUserDeleteView.as_view(), name='admin-user-delete'),

     # admin campaigns without pagination
    path("admin-donations/", DonationCampaignAdminListAPIView.as_view(), name="admin-campaigns"),
]


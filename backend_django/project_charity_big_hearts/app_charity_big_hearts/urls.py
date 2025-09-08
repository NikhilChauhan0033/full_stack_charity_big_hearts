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
)

from rest_framework_simplejwt.views import TokenRefreshView, TokenBlacklistView

urlpatterns = [
    # 🔐 Auth
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', MyTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', TokenBlacklistView.as_view(), name='logout'),

    # 📦 API Endpoints
    path('categories/', DonationCategoryListCreateAPIView.as_view(), name='category-list'),
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
]


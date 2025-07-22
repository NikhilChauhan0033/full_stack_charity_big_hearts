from django.urls import path
from .views import (
    RegisterView, MyTokenObtainPairView,
    DonationCategoryListCreateAPIView,
    DonationCampaignListCreateAPIView,
    DonationCampaignDetailAPIView,
    DonationListCreateAPIView,
    DonationDetailAPIView,
    TeamListCreateAPIView, 
    TeamDetailAPIView

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
]

from rest_framework import serializers 
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .models import DonationCategory, DonationCampaign, Donation


# RegisterSerializer → for registering a new user.
class RegisterSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['name', 'email', 'password', 'confirm_password']

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"error": "Passwords do not match"})
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({"error": "Email already exists"})
        if User.objects.filter(username=data['name']).exists():
            raise serializers.ValidationError({"error": "Username already exists"})
        return data

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['name'],
            first_name=validated_data['name'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

# MyTokenObtainPairSerializer → for logging in with either email or username and generating JWT tokens.


class MyTokenObtainPairSerializer(serializers.Serializer):
    identifier = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        identifier = attrs.get("identifier")
        password = attrs.get("password")

        # Try to get user by username or email
        user = User.objects.filter(username=identifier).first()
        if not user:
            user = User.objects.filter(email=identifier).first()

        if not user:
            raise serializers.ValidationError({"error": "User not found."})

        if not user.check_password(password):
            raise serializers.ValidationError({"error": "Incorrect password."})

        # Generate tokens manually
        refresh = RefreshToken.for_user(user)

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "username": user.first_name or user.username,
        }



class DonationCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = DonationCategory
        fields = ['id', 'name']


class DonationCampaignSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=DonationCategory.objects.all())
    to_go = serializers.SerializerMethodField()

    class Meta:
        model = DonationCampaign
        fields = ['id', 'category', 'image', 'title', 'goal_amount', 'raised_amount', 'to_go']

    def get_to_go(self, obj):
        return obj.to_go()

class DonationSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Donation
        fields = '__all__'
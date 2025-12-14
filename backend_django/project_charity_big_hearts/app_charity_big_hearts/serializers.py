from rest_framework import serializers  # DRF serializers are used to convert complex data (models) into JSON and vice versa
from django.contrib.auth.models import User  # Django's built-in User model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer  # Used for JWT authentication (login)
from rest_framework_simplejwt.tokens import RefreshToken  # Used to manually generate JWT refresh & access tokens
from .models import DonationCategory, DonationCampaign, Donation, Team, Contact, Cart  # Importing project models


# -------------------- Register Serializer --------------------
# This serializer is used to register (create) a new user
class RegisterSerializer(serializers.ModelSerializer):
    # Custom fields added that are not directly in User model
    name = serializers.CharField(write_only=True)  # write_only means it is used only for input, not returned in response
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User  # Using Django's User model
        fields = ['name', 'email', 'password', 'confirm_password']

    def validate(self, data):
        # Check if password and confirm password are the same
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"error": "Passwords do not match"})

        # Check if email already exists
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({"error": "Email already exists"})

        # Check if username already exists
        if User.objects.filter(username=data['name']).exists():
            raise serializers.ValidationError({"error": "Username already exists"})

        return data  # Return validated data if all checks pass

    def create(self, validated_data):
        # Create a new user using Django's create_user method
        user = User.objects.create_user(
            username=validated_data['name'],
            first_name=validated_data['name'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user  # Return created user object


# -------------------- Custom Login (JWT) Serializer --------------------
# This serializer allows login using either username OR email
class MyTokenObtainPairSerializer(serializers.Serializer):
    identifier = serializers.CharField()  # Can be username or email
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        identifier = attrs.get("identifier")
        password = attrs.get("password")

        # First try to find user by username
        user = User.objects.filter(username=identifier).first()

        # If not found, try to find user by email
        if not user:
            user = User.objects.filter(email=identifier).first()

        # If user does not exist
        if not user:
            raise serializers.ValidationError({"error": "User not found."})

        # If password is incorrect
        if not user.check_password(password):
            raise serializers.ValidationError({"error": "Incorrect password."})

        # Generate JWT refresh and access tokens manually
        refresh = RefreshToken.for_user(user)

        # Return tokens and additional user info
        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "username": user.first_name or user.username,
            "is_admin": user.is_staff or user.is_superuser,
        }


# -------------------- Donation Category Serializer --------------------
class DonationCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = DonationCategory
        fields = ['id', 'name']  # Fields to be returned in API response


# -------------------- Donation Campaign Serializer --------------------
class DonationCampaignSerializer(serializers.ModelSerializer):
    # Accept category as primary key (ID)
    category = serializers.PrimaryKeyRelatedField(queryset=DonationCategory.objects.all())

    # Custom field calculated using a method
    to_go = serializers.SerializerMethodField()

    class Meta:
        model = DonationCampaign
        fields = ['id', 'category', 'image', 'title', 'goal_amount', 'raised_amount', 'to_go']

    def get_to_go(self, obj):
        # Calls the to_go() method from model to calculate remaining amount
        return obj.to_go()


# -------------------- Donation Serializer --------------------
class DonationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donation
        fields = '__all__'  # Includes all fields from Donation model


# -------------------- Team Serializer --------------------
class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = '__all__'  # Serialize all team fields


# -------------------- Contact Serializer --------------------
class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = '__all__'  # Serialize all contact form fields


# -------------------- Cart Serializer (POST / CREATE) --------------------
# Used when user adds a campaign to cart
class CartSerializer(serializers.ModelSerializer):
    # Accept campaign ID from frontend
    campaign = serializers.PrimaryKeyRelatedField(queryset=DonationCampaign.objects.all())

    # Ensure minimum donation amount is greater than zero
    donation_amount = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        min_value=0.01
    )

    class Meta:
        model = Cart
        fields = ['id', 'user', 'campaign', 'donation_amount', 'added_at']
        read_only_fields = ['user', 'added_at']  # These fields are set automatically


# -------------------- Cart Read Serializer (GET) --------------------
# Used when returning cart items with full campaign details
class CartReadSerializer(serializers.ModelSerializer):
    # Nested serializer to show full campaign data instead of just ID
    campaign = DonationCampaignSerializer(read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'user', 'campaign', 'donation_amount', 'added_at']


# -------------------- Donation Create Serializer --------------------
# Used when creating a donation entry
class DonationCreateSerializer(serializers.ModelSerializer):
    campaign = serializers.PrimaryKeyRelatedField(queryset=DonationCampaign.objects.all())
    name = serializers.CharField(max_length=100)
    surname = serializers.CharField(max_length=100)
    email = serializers.EmailField()

    # Donation must be at least ₹10
    donation_amount = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=10.00)

    # Payment mode choices
    payment_mode = serializers.ChoiceField(choices=[('upi', 'UPI'), ('card', 'Card')])

    class Meta:
        model = Donation
        fields = ['campaign', 'name', 'surname', 'email', 'donation_amount', 'payment_mode']

    def validate_donation_amount(self, value):
        # Validate minimum donation amount
        if value < 10:
            raise serializers.ValidationError("Minimum donation amount is ₹10.")

        # Validate maximum donation amount
        if value > 1000000:
            raise serializers.ValidationError("Maximum donation amount is ₹10,00,000.")

        return value

    def create(self, validated_data):
        # Create donation entry
        donation = Donation.objects.create(**validated_data)

        # Update the raised amount of the campaign
        campaign = validated_data['campaign']
        campaign.raised_amount += validated_data['donation_amount']
        campaign.save()

        return donation


# -------------------- User Profile Serializer --------------------
# Used for viewing and updating user profile details
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'email', 'date_joined']
        read_only_fields = ['id', 'username', 'date_joined']

    def validate_email(self, value):
        user = self.instance

        # Ensure email is unique for other users
        if User.objects.exclude(pk=user.pk).filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use.")

        return value

    def update(self, instance, validated_data):
        # Update user profile fields
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.email = validated_data.get('email', instance.email)
        instance.save()
        return instance


# -------------------- Change Password Serializer --------------------
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)

    def validate_old_password(self, value):
        # Check if old password is correct
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect.")
        return value

    def validate_new_password(self, value):
        # Basic password strength validation
        if len(value) < 8:
            raise serializers.ValidationError("New password must be at least 8 characters long.")
        return value

    def save(self):
        # Update user password securely
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user


# -------------------- Admin User Serializer --------------------
# Used to display admin and user roles
class AdminUserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()  # Custom field for role name

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_staff', 'is_superuser', 'date_joined', 'role']

    def get_role(self, obj):
        # Determine user role based on permissions
        if obj.is_superuser:
            return "Super Admin"
        elif obj.is_staff:
            return "Admin"
        return "User"

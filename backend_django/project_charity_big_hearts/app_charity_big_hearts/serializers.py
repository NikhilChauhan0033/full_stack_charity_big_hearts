from rest_framework import serializers 
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .models import DonationCategory, DonationCampaign, Donation, Team,Contact,Cart


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
    # image = serializers.ImageField(use_url=True)

    class Meta:
        model = DonationCampaign
        fields = ['id', 'category', 'image', 'title', 'goal_amount', 'raised_amount', 'to_go']

    def get_to_go(self, obj):
        return obj.to_go()

class DonationSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Donation
        fields = '__all__'

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = '__all__'


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = '__all__'

        
# For POST/CREATE: Accept campaign ID
class CartSerializer(serializers.ModelSerializer):
    campaign = serializers.PrimaryKeyRelatedField(queryset=DonationCampaign.objects.all())
    donation_amount = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=0.01)  # ✅ Ensure minimum donation

    class Meta:
        model = Cart
        fields = ['id', 'user', 'campaign', 'donation_amount', 'added_at']
        read_only_fields = ['user', 'added_at']

# For GET: Return full campaign details
class CartReadSerializer(serializers.ModelSerializer):
    campaign = DonationCampaignSerializer(read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'user', 'campaign', 'donation_amount', 'added_at']

class DonationCreateSerializer(serializers.ModelSerializer):
    campaign = serializers.PrimaryKeyRelatedField(queryset=DonationCampaign.objects.all())
    name = serializers.CharField(max_length=100)
    surname = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    donation_amount = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=10.00)
    payment_mode = serializers.ChoiceField(choices=[('upi', 'UPI'), ('card', 'Card')])

    class Meta:
        model = Donation
        fields = ['campaign', 'name', 'surname', 'email', 'donation_amount', 'payment_mode']

    def validate_donation_amount(self, value):
        if value < 10:
            raise serializers.ValidationError("Minimum donation amount is ₹10.")
        if value > 1000000:
            raise serializers.ValidationError("Maximum donation amount is ₹10,00,000.")
        return value

    def create(self, validated_data):
        # Create the donation
        donation = Donation.objects.create(**validated_data)
        
        # Update campaign raised amount
        campaign = validated_data['campaign']
        campaign.raised_amount += validated_data['donation_amount']
        campaign.save()
        
        return donation
    

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'email', 'date_joined']
        read_only_fields = ['id', 'username', 'date_joined']

    def validate_email(self, value):
        user = self.instance
        if User.objects.exclude(pk=user.pk).filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value

    def update(self, instance, validated_data):
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.email = validated_data.get('email', instance.email)
        instance.save()
        return instance


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect.")
        return value

    def validate_new_password(self, value):
        # Add any password strength validation here
        if len(value) < 8:
            raise serializers.ValidationError("New password must be at least 8 characters long.")
        return value

    def save(self):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user

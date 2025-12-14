from django.db import models
from django.contrib.auth.models import User  # Importing Django's built-in User model for authentication

# -------------------- Donation Category Model --------------------
class DonationCategory(models.Model):
    # Stores the name of the donation category (e.g., Food, Education, Health)
    name = models.CharField(max_length=100)

    def __str__(self):
        # This is shown in Django admin and shell for better readability
        return self.name


# -------------------- Donation Campaign Model --------------------
class DonationCampaign(models.Model):
    # Each campaign belongs to one category
    # on_delete=models.CASCADE means if category is deleted, related campaigns are also deleted
    # related_name='campaigns' allows reverse access like category.campaigns.all()
    category = models.ForeignKey(DonationCategory, on_delete=models.CASCADE, related_name='campaigns')

    # Stores campaign image, uploaded inside 'donation_images/' folder
    image = models.ImageField(upload_to='donation_images/')

    # Title of the donation campaign
    title = models.CharField(max_length=200)

    # Total amount that needs to be collected
    goal_amount = models.DecimalField(max_digits=10, decimal_places=2)

    # Amount collected so far (default is 0)
    raised_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def to_go(self):
        # Calculates remaining amount needed to reach the goal
        # max() ensures the value never goes below 0
        return max(self.goal_amount - self.raised_amount, 0)

    def __str__(self):
        # Displays campaign title in admin panel
        return self.title


# -------------------- Donation Model --------------------
class Donation(models.Model):
    # Links donation to a specific campaign
    campaign = models.ForeignKey(DonationCampaign, on_delete=models.CASCADE)

    # Donor's first name
    name = models.CharField(max_length=100)

    # Donor's surname
    surname = models.CharField(max_length=100)

    # Donor's email address
    email = models.EmailField()

    # Amount donated by the user
    donation_amount = models.DecimalField(max_digits=10, decimal_places=2)

    # Payment mode selected by the donor (UPI or Card)
    payment_mode = models.CharField(
        max_length=50,
        choices=[
            ('upi', 'UPI'),
            ('card', 'Card'),
        ]
    )

    # Automatically stores date and time when donation is made
    donated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        # Shows donor name and donation amount for easy identification
        return f"{self.name} donated {self.donation_amount}"


# -------------------- Team Model --------------------
class Team(models.Model):
    # Team member image uploaded to 'team_images/' folder
    image = models.ImageField(upload_to='team_images/')

    # Name of the team member
    name = models.CharField(max_length=100)

    # Role of the team member (e.g., Volunteer, Outreach Volunteer)
    role = models.CharField(max_length=100)

    # Short description about the team member
    small_description = models.CharField(max_length=255)

    # Experience of the team member
    experience = models.CharField(max_length=100)

    # Email address of the team member
    email = models.EmailField()

    # Phone number of the team member
    phone_no = models.CharField(max_length=15)

    def __str__(self):
        # Displays team member name in admin panel
        return self.name


# -------------------- Contact Model --------------------
class Contact(models.Model):
    # Name of the person who contacted
    name = models.CharField(max_length=100)

    # Email of the person who contacted
    email = models.EmailField()

    # Message sent by the user
    message = models.TextField()

    # Automatically stores date and time of contact submission
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        # Displays contact name in admin panel
        return self.name


# -------------------- Cart Model --------------------
class Cart(models.Model):
    # Links cart item to a logged-in user
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="cart_items")

    # Donation campaign added to the cart
    campaign = models.ForeignKey(DonationCampaign, on_delete=models.CASCADE)

    # Stores selected donation amount for the campaign
    donation_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00  # Default donation amount is zero
    )

    # Automatically stores when the item was added to cart
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Ensures one user cannot add the same campaign multiple times
        unique_together = ['user', 'campaign']

    def __str__(self):
        # Displays cart details clearly in admin panel
        return f"{self.user.username} - {self.campaign.title} - {self.donation_amount}"

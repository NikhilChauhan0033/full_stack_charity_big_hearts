from django.db import models

class DonationCategory(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class DonationCampaign(models.Model):
    category = models.ForeignKey(DonationCategory, on_delete=models.CASCADE, related_name='campaigns')
    image = models.ImageField(upload_to='donation_images/')
    title = models.CharField(max_length=200)
    goal_amount = models.DecimalField(max_digits=10, decimal_places=2)
    raised_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def to_go(self):
        return max(self.goal_amount - self.raised_amount, 0)

    def __str__(self):
        return self.title


class Donation(models.Model):
    campaign = models.ForeignKey(DonationCampaign, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    surname = models.CharField(max_length=100)
    email = models.EmailField()
    donation_amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_mode = models.CharField(max_length=50, choices=[
        ('upi', 'UPI'),
        ('card', 'Card'),
        ('paypal', 'PayPal')
    ])
    donated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} donated {self.donation_amount}"

class Team(models.Model):
    image = models.ImageField(upload_to='team_images/')
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=100)  # Example: "Volunteer", "Outreach Volunteer"
    small_description = models.CharField(max_length=255)
    experience = models.CharField(max_length=100)
    email = models.EmailField()
    phone_no = models.CharField(max_length=15)

    def __str__(self):
        return self.name

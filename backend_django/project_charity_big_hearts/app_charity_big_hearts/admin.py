from django.contrib import admin
from .models import *

# Register your models here.

admin.site.register([DonationCategory,DonationCampaign,Donation,Team,Contact])
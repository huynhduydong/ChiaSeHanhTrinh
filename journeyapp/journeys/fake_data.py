# generate_fake_data.py

import os
import django
from faker import Faker
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'journeyapp.settings')  # Thay 'myproject' bằng tên dự án của bạn
django.setup()

from journeys.models import User, Tag, Journey, Comment, JoinJourney, Rating, Report, PlaceVisit

fake = Faker()

def delete_existing_data():
    Comment.objects.all().delete()
    JoinJourney.objects.all().delete()
    Rating.objects.all().delete()
    Report.objects.all().delete()
    PlaceVisit.objects.all().delete()
    Journey.objects.all().delete()
    Tag.objects.all().delete()
    User.objects.all().delete()

def create_fake_users(n):
    users = []
    for _ in range(n):
        username = fake.user_name()
        email = fake.email()
        avatar = fake.image_url()
        role = random.choice(['admin', 'customer'])

        user = User.objects.create_user(
            username=username,
            email=email,
            password='dong',  # Sử dụng mật khẩu mặc định hoặc tạo mật khẩu ngẫu nhiên
            avatar=avatar,
            role=role
        )
        users.append(user)
    return users

def create_fake_tags(n):
    tags = ['Du lịch', 'Khám phá', 'Ẩm thực', 'Văn hóa', 'Thiên nhiên']
    tag_objects = []
    for tag_name in tags:
        tag_objects.append(Tag.objects.create(name=tag_name))
    return tag_objects

def create_fake_journeys(users, tags, journeys_per_user=10):
    journeys = []
    for user in users:
        for _ in range(journeys_per_user):
            name = fake.sentence(nb_words=6)
            description = fake.text()

            journey = Journey.objects.create(
                name=name,
                description=description,
                user_journey=user
            )
            journey.tags.set(random.sample(tags, k=min(len(tags), 3)))
            journeys.append(journey)
    return journeys

def create_fake_comments(journeys, users, comments_per_journey=6):
    for journey in journeys:
        for _ in range(comments_per_journey):
            cmt = fake.sentence(nb_words=10)
            user = random.choice(users)

            comment = Comment.objects.create(
                cmt=cmt,
                user=user,
                journey=journey
            )
            comment.save()

def create_fake_join_journeys(journeys, users):
    for journey in journeys:
        user = random.choice(users)
        join_journey = JoinJourney.objects.create(
            user=user,
            journey=journey
        )
        join_journey.save()

def create_fake_ratings(journeys, users):
    for journey in journeys:
        user = random.choice(users)
        rate = random.randint(1, 5)
        rating = Rating.objects.create(
            rate=rate,
            user=user,
            journey=journey
        )
        rating.save()

def create_fake_reports(users):
    for _ in range(len(users)):
        reason = fake.sentence(nb_words=10)
        user = random.choice(users)

        report = Report.objects.create(
            reason=reason,
            user=user
        )
        report.save()

def create_fake_place_visits(journeys, places_per_journey=3):
    for journey in journeys:
        for _ in range(places_per_journey):
            latitude = fake.latitude()
            longitude = fake.longitude()
            name = fake.city()
            description = fake.text()
            address = fake.address()

            place_visit = PlaceVisit.objects.create(
                latitude=latitude,
                longitude=longitude,
                name=name,
                description=description,
                address=address,
                journey=journey
            )
            place_visit.save()

if __name__ == '__main__':
    delete_existing_data()
    users = create_fake_users(10)
    tags = create_fake_tags(10)
    journeys = create_fake_journeys(users, tags)
    create_fake_comments(journeys, users)
    create_fake_join_journeys(journeys, users)
    create_fake_ratings(journeys, users)
    create_fake_reports(users)
    create_fake_place_visits(journeys)
    print("Fake data created successfully")

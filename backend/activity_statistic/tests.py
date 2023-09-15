import datetime
import warnings

from django.contrib.auth.models import User
from django.urls import resolve
from rest_framework.test import APITestCase

warnings.filterwarnings("ignore", category=RuntimeWarning)


class ActivityStatisticsAPITestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user("manga", "manga@linea.org", "manga")
        self.client.login(username="manga", password="manga")

    def test_list_Statistics_route(self):
        route = resolve("/api/statistics/")
        self.assertEqual(route.func.__name__, "ActivityStatisticViewSet")

    def test_list_statistics(self):
        response = self.client.get("/api/statistics/")
        self.assertEqual(response.status_code, 200)

    def test_create_statistics(self):
        event = "test event"
        post_data = {
            "event": event,
        }
        response = self.client.post("/api/statistics/", post_data, format="json")
        self.assertEqual(response.status_code, 201)

        # return new statistics list
        response = self.client.get("/api/statistics/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]["event"], "API - login")
        self.assertEqual(response.data[1]["event"], event)
        self.assertEqual(response.data[0]["owner"], "manga")

        # change statistics event
        newEvent = "test event2"
        put_data = {"event": newEvent}
        response = self.client.put("/api/statistics/1/", put_data, format="json")
        self.assertEqual(response.status_code, 200)

        # return new statistics list
        response = self.client.get("/api/statistics/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]["event"], newEvent)

        # delete statistics
        response = self.client.delete("/api/statistics/1/")
        self.assertEqual(response.status_code, 204)

        # return new statistics list - (return 0 userqueries)
        response = self.client.get("/api/statistics/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

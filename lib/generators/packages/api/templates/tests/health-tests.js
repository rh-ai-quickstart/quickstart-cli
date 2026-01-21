export const generateHealthTests = (params) => {
    const { config } = params;
    const dbTests = config.features.db
        ? `

def test_health_check_includes_database(health_response):
    """Test health check includes database status"""
    db_service = assert_service_exists(health_response, "Database")

    assert db_service["status"] in ["healthy", "down"]
    assert "message" in db_service
    assert "version" in db_service


def test_health_check_api_service(health_response):
    """Test health check includes API service"""
    api_service = assert_service_exists(health_response, "API")

    assert api_service["status"] == "healthy"
    assert api_service["message"] == "API is running"
    assert api_service["version"] == "0.0.0"`
        : `

def test_health_check_api_only(health_response):
    """Test health check returns only API service"""
    assert len(health_response) == 1

    api_service = health_response[0]
    assert api_service["name"] == "API"
    assert api_service["status"] == "healthy"
    assert api_service["message"] == "API is running"
    assert api_service["version"] == "0.0.0"`;
    return /* python */ `"""
Health endpoint tests
"""

from helpers import assert_service_exists


def test_health_check_endpoint_exists(health_response):
    """Test health check endpoint returns list of services"""
    assert isinstance(health_response, list)
    assert len(health_response) >= 1  # At least API service should be present
${dbTests}


def test_root_endpoint(client):
    """Test root endpoint returns welcome message"""
    response = client.get("/")
    assert response.status_code == 200

    data = response.json()
    assert "message" in data
`;
};

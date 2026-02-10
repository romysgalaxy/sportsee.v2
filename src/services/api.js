import Cookies from 'js-cookie'

const API_BASE_URL = 'http://localhost:8000'

class ApiService {
  getAuthHeaders() {
    const token = Cookies.get('authToken')
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  async handleResponse(response) {
    if (!response.ok) {
      if (response.status === 401) {
        Cookies.remove('authToken')
        Cookies.remove('userId')
        window.location.href = '/login'
        throw new Error('Session expirée. Veuillez vous reconnecter.')
      }
      throw new Error(`Erreur API: ${response.statusText}`)
    }
    return response.json()
  }

  async getUserInfo() {
    const response = await fetch(`${API_BASE_URL}/api/user-info`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  async getUserActivity(startWeek, endWeek) {
    const params = new URLSearchParams({
      startWeek,
      endWeek,
    })
    const response = await fetch(`${API_BASE_URL}/api/user-activity?${params}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }
}

export const apiService = new ApiService()

import axios from 'axios'

require('dotenv').config(); 
const apiClient = axios.create({
  baseURL: 'https://api-cmru.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  }
})

export const instructorAPI = {
  getAll() {
    return apiClient.get('/instructors')
  },
  create(data) {
    return apiClient.post('/instructors', data)
  },
  update(id, data) {
    return apiClient.put(`/instructors/${id}`, data)
  },
  delete(id) {
    return apiClient.delete(`/instructors/${id}`)
  }
}

export const roomAPI = {
  getAll() {
    return apiClient.get('/rooms')
  },

  create(data) {
    return apiClient.post('/rooms', data)
  },
  update(id, data) {
    return apiClient.put(`/rooms/${id}`, data)
  },
  delete(id) {
    return apiClient.delete(`/rooms/${id}`)
  }
}

export const LocationAPI = {

  getAll() {
    return apiClient.get('/Locations')
  },
  create(data) {
    return apiClient.post('/Locations', data)
  },
  update(id, data) {
    return apiClient.put(`/Locations/${id}`, data)
  },
  delete(id) {
    return apiClient.delete(`/Locations/${id}`)
  }
}

export const PhilosophyAPI = {
  getAll() {
    return apiClient.get('/Philosophy')
  },
  create(data) {
    return apiClient.post('/Philosophy', data)
  },
  update(id, data) {
    return apiClient.put(`/Philosophy/${id}`, data)
  },
  delete(id) {
    return apiClient.delete(`/Philosophy/${id}`)
  }
}

export const CourseAPI = {
  getAll() {
    return apiClient.get('/courses')
  },
  create(data) {
    return apiClient.post('/courses', data)
  },
  update(id, data) {
    return apiClient.put(`/courses/${id}`, data)
  },
  delete(id) {
    return apiClient.delete(`/courses/${id}`)
  }
}

export const DegreeProgramAPI = {
  getAll() {
    return apiClient.get('/degree_programs')
  },
  create(data) {
    return apiClient.post('/degree_programs', data)
  },
  update(id, data) {
    return apiClient.put(`/degree_programs/${id}`, data)
  },
  delete(id) {
    return apiClient.delete(`/degree_programs/${id}`)
  }
}

export const instructorSjAPI = {
  getAll() {
    return apiClient.get('/instructor_sj')
  },
  create(data) {
    return apiClient.post('/instructor_sj', data)
  },
  update(id, data) {
    return apiClient.put(`/instructor_sj/${id}`, data)
  },
  delete(id) {
    return apiClient.delete(`/instructor_sj/${id}`)
  }
}

export const subjectAPI = {
  getAll() {
    return apiClient.get('/subjects')
  },
  create(data) {
    return apiClient.post('/subjects', data)
  },
  update(id, data) {
    return apiClient.put(`/subjects/${id}`, data)
  },
  delete(id) {
    return apiClient.delete(`/subjects/${id}`)
  }
}

export const programSubjectAPI = {
  getAll() {
    return apiClient.get('/program_subjects')
  },
  create(data) {
    return apiClient.post('/program_subjects', data)
  },
  update(id, data) {
    return apiClient.put(`/program_subjects/${id}`, data)
  },
  delete(id) {
    return apiClient.delete(`/program_subjects/${id}`)
  }
}

export const intentAPI = {
  getAll() {
    return apiClient.get('/intents')
  },
  create(data) {
    return apiClient.post('/intents', data)
  },
  update(id, data) {
    return apiClient.put(`/intents/${id}`, data)
  },
  delete(id) {
    return apiClient.delete(`/intents/${id}`)
  }
}

export const trainingPhraseAPI = {
  getAll() {
    return apiClient.get('/training_phrases')
  },
  create(data) {
    return apiClient.post('/training_phrases', data)
  },
  update(id, data) {
    return apiClient.put(`/training_phrases/${id}`, data)
  },
  delete(id) {
    return apiClient.delete(`/training_phrases/${id}`)
  }
}

export const adminAPI = {
  getAll() {
    return apiClient.get('/admin')
  },
  create(data) {
    return apiClient.post('/admin', data)
  },
  update(id, data) {
    return apiClient.put(`/admin/${id}`, data)
  },
  delete(id) {
    return apiClient.delete(`/admin/${id}`)
  }
}
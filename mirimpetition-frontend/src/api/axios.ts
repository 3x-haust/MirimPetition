import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8080', // Spring Boot 서버 주소
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default instance; 
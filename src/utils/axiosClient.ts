import axios from 'axios'
import { config } from 'dotenv'

config()

export const axiosClient = axios.create({
  baseURL: process.env.SCRAPE_WEB_BASE_URL
})
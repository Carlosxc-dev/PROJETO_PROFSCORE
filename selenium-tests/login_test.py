from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium import webdriver
import time


BACKEND_URL = "http://localhost:3000"
FRONTEND_URL = "http://localhost:4200/login"




driver = webdriver.Chrome()
wait = WebDriverWait(driver, 10)

driver.get(FRONTEND_URL)
time.sleep(1) #Esperar 1 segundo para o carregamento visual

# Input de email
email_input = wait.until(
    EC.element_to_be_clickable((By.CSS_SELECTOR, 'input[placeholder="Email do Usuário"]'))
)
email_input.send_keys("usuario@teste.com")
time.sleep(2)

# Input de senha (ajustar seletor conforme HTML real)
password_input = wait.until(
    EC.element_to_be_clickable((By.CSS_SELECTOR, 'app-input-group input[type="password"]'))
)
password_input.send_keys("senha123")
time.sleep(2)

login_button = wait.until(
    EC.presence_of_element_located(
        (By.XPATH, '//app-login//*[contains(text(), "Enviar")]')
    )
)
driver.execute_script("arguments[0].click();", login_button)
time.sleep(2)

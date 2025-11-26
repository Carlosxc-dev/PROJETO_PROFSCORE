import unittest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class TestCRUDInstituto(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.maximize_window()
        self.wait = WebDriverWait(self.driver, 10)
        self.driver.get("http://127.0.0.1:5500/frontend/index.html#")

    def tearDown(self):
        self.driver.quit()

    def test_crud_instituto(self):
        driver = self.driver
        wait = self.wait

        # === LOGIN ===
        wait.until(EC.visibility_of_element_located((By.ID, "loginEmail"))).send_keys("admin@admin.com")
        wait.until(EC.visibility_of_element_located((By.ID, "loginPassword"))).send_keys("1234567")
        wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button[type='submit']"))).click()
        wait.until(EC.visibility_of_element_located((By.ID, "dashboard")))
        time.sleep(1)

        # === ABRIR INSTITUTO ===
        wait.until(EC.element_to_be_clickable(
            (By.CSS_SELECTOR, ".menu-card[onclick=\"showSection('instituto')\"]")
        )).click()
        time.sleep(1)
        wait.until(EC.visibility_of_element_located((By.ID, "institutoSection")))
        time.sleep(1)

        # === NOVO INSTITUTO ===
        novo = wait.until(EC.element_to_be_clickable(
            (By.XPATH, "//button[contains(text(),'+ Novo Instituto')]")
        ))
        driver.execute_script("arguments[0].scrollIntoView({block:'center'});", novo)
        time.sleep(1)
        novo.click()

        wait.until(EC.visibility_of_element_located((By.ID, "institutoNome"))).send_keys("Instituto de Teste Selenium")
        time.sleep(1)
        wait.until(EC.visibility_of_element_located((By.ID, "institutoSigla"))).send_keys("ITS")
        time.sleep(1)

        wait.until(EC.element_to_be_clickable(
            (By.XPATH, "//div[@id='institutoModal']//button[contains(text(),'Salvar')]")
        )).click()
        
        time.sleep(1)
        wait.until(EC.invisibility_of_element_located((By.ID, "institutoModal")))
        time.sleep(1)

        # === EDITAR ===
        wait.until(lambda d: len(d.find_elements(By.XPATH, "//button[contains(@onclick,'editInstituto')]")) > 0)
        btns = driver.find_elements(By.XPATH, "//button[contains(@onclick,'editInstituto')]")
        btns[-1].click()
        time.sleep(1)

        campo = wait.until(EC.visibility_of_element_located((By.ID, "institutoNome")))
        time.sleep(1)
        campo.clear()
        time.sleep(1)
        campo.send_keys("Instituto Editado Selenium")
        time.sleep(1)

        wait.until(EC.element_to_be_clickable(
            (By.XPATH, "//div[@id='institutoModal']//button[contains(text(),'Salvar')]")
        )).click()
        time.sleep(1)
        wait.until(EC.invisibility_of_element_located((By.ID, "institutoModal")))
        time.sleep(1)

        # === EXCLUIR ===
        wait.until(lambda d: len(d.find_elements(By.XPATH, "//button[contains(@onclick,'deleteInstituto')]")) > 0)
        btns_exc = driver.find_elements(By.XPATH, "//button[contains(@onclick,'deleteInstituto')]")
        btns_exc[-1].click()
        time.sleep(1)

        alerta = wait.until(EC.alert_is_present())
        time.sleep(1)
        alerta.accept()
        time.sleep(2)

        print("\n✔ CRUD de Instituto executado com sucesso!\n")


if __name__ == "__main__":
    unittest.main()

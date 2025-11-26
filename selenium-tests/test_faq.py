import unittest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class TestCRUDFaq(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.maximize_window()
        self.wait = WebDriverWait(self.driver, 10)
        self.driver.get("file:///C:/Users/carlos.xavier/Documents/PROJETO_PROFSCORE/frontend/index.html#")

    def tearDown(self):
        self.driver.quit()

    def test_crud_faq(self):
        driver = self.driver
        wait = self.wait

        # === LOGIN ===
        wait.until(EC.visibility_of_element_located((By.ID, "loginEmail"))).send_keys("admin@admin.com")
        wait.until(EC.visibility_of_element_located((By.ID, "loginPassword"))).send_keys("1234567")
        wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button[type='submit']"))).click()
        wait.until(EC.visibility_of_element_located((By.ID, "dashboard")))
        time.sleep(1)

        # === ABRIR FAQ ===
        wait.until(EC.element_to_be_clickable(
            (By.CSS_SELECTOR, ".menu-card[onclick=\"showSection('faq')\"]")
        )).click()
        wait.until(EC.visibility_of_element_located((By.ID, "faqSection")))
        time.sleep(1)

        # === NOVA FAQ ===
        btn_novo = wait.until(EC.element_to_be_clickable(
            (By.XPATH, "//button[contains(text(),'+ Nova Pergunta')]")
        ))
        driver.execute_script("arguments[0].scrollIntoView({block:'center'});", btn_novo)
        time.sleep(1)
        btn_novo.click()
        time.sleep(1)
        
        wait.until(EC.visibility_of_element_located((By.ID, "faqPergunta"))).send_keys("Pergunta de Teste Selenium")
        time.sleep(1)
        wait.until(EC.visibility_of_element_located((By.ID, "faqResposta"))).send_keys("Resposta criada automaticamente.")
        time.sleep(1)

        # SALVAR
        wait.until(EC.element_to_be_clickable(
            (By.XPATH, "//div[@id='faqModal']//button[contains(text(),'Salvar')]")
        )).click()

        wait.until(EC.invisibility_of_element_located((By.ID, "faqModal")))
        time.sleep(1)

        # === EDITAR ===
        wait.until(lambda d: len(d.find_elements(By.XPATH, "//button[contains(@onclick,'editFaq')]")) > 0)
        btns = driver.find_elements(By.XPATH, "//button[contains(@onclick,'editFaq')]")
        btns[-1].click()
        time.sleep(1)

        campo_resposta = wait.until(EC.visibility_of_element_located((By.ID, "faqResposta")))
        campo_resposta.clear()
        time.sleep(1)
        campo_resposta.send_keys("Resposta editada via Selenium.")
        time.sleep(1)

        wait.until(EC.element_to_be_clickable(
            (By.XPATH, "//div[@id='faqModal']//button[contains(text(),'Salvar')]")
        )).click()
        wait.until(EC.invisibility_of_element_located((By.ID, "faqModal")))
        time.sleep(1)

        # === EXCLUIR ===
        wait.until(lambda d: len(d.find_elements(By.XPATH, "//button[contains(@onclick,'deleteFaq')]")) > 0)
        btns_exc = driver.find_elements(By.XPATH, "//button[contains(@onclick,'deleteFaq')]")
        btns_exc[-1].click()

        alerta = wait.until(EC.alert_is_present())
        time.sleep(1)
        alerta.accept()
        time.sleep(2)

        print("\n✔ CRUD de FAQ executado com sucesso!\n")


if __name__ == "__main__":
    unittest.main()

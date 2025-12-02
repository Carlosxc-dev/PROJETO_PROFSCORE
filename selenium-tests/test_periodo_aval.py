import unittest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class TestCRUDPeriodo(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.maximize_window()
        self.wait = WebDriverWait(self.driver, 10)
        self.driver.get("http://127.0.0.1:5500/frontend/index.html#")

    def tearDown(self):
        self.driver.quit()

    # Função utilitária para preencher datetime-local corretamente
    def set_datetime(self, element_id, datetime_str):
        elem = self.driver.find_element(By.ID, element_id)
        # Preenchimento FORÇADO via JS (a única forma 100% confiável)
        self.driver.execute_script(
            "arguments[0].value = arguments[1]; arguments[0].dispatchEvent(new Event('input'));",
            elem,
            datetime_str
        )

    def test_crud_periodo(self):
        driver = self.driver
        wait = self.wait

        # === LOGIN ===
        wait.until(EC.visibility_of_element_located((By.ID, "loginEmail"))).send_keys("admin@admin.com")
        wait.until(EC.visibility_of_element_located((By.ID, "loginPassword"))).send_keys("1234567")
        wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button[type='submit']"))).click()
        wait.until(EC.visibility_of_element_located((By.ID, "dashboard")))
        time.sleep(1)

        # === ABRIR PERÍODO DE AVALIAÇÃO ===
        wait.until(EC.element_to_be_clickable(
            (By.CSS_SELECTOR, ".menu-card[onclick=\"showSection('periodo')\"]")
        )).click()

        wait.until(EC.visibility_of_element_located((By.ID, "periodoSection")))
        time.sleep(1)

        # === NOVO PERÍODO ===
        btn_novo = wait.until(
            EC.presence_of_element_located((By.XPATH, "//button[contains(text(),'+ Novo Período')]"))
        )
        driver.execute_script("arguments[0].scrollIntoView({block:'center'});", btn_novo)
        btn_novo.click()

        descricao = wait.until(EC.visibility_of_element_located((By.ID, "periodoDescricao")))
        wait.until(EC.visibility_of_element_located((By.ID, "periodoInicio")))
        wait.until(EC.visibility_of_element_located((By.ID, "periodoFim")))
        time.sleep(1)
        
        descricao.clear()
        descricao.send_keys("Período criado via Selenium.")
        time.sleep(1)

        # === Preencher datas corretamente (FORMATO OBRIGATÓRIO DO datetime-local) ===
        self.set_datetime("periodoInicio", "2025-02-01T09:00")
        self.set_datetime("periodoFim", "2025-03-01T17:00")

        time.sleep(1)

        # === Salvar ===
        wait.until(
            EC.element_to_be_clickable(
                (By.XPATH, "//div[@id='periodoModal']//button[contains(text(),'Salvar')]")
            )
        ).click()

        # Esperar fechar modal
        wait.until(EC.invisibility_of_element_located((By.ID, "periodoModal")))
        time.sleep(1)

        # === EDITAR PERÍODO ===
        wait.until(lambda d: len(d.find_elements(By.XPATH, "//button[contains(@onclick,'editPeriodo')]")) > 0)
        btns_editar = driver.find_elements(By.XPATH, "//button[contains(@onclick,'editPeriodo')]")
        btns_editar[-1].click()
        time.sleep(1)
        
        descricao = wait.until(EC.visibility_of_element_located((By.ID, "periodoDescricao")))
        descricao.clear()
        descricao.send_keys("Período editado via Selenium.")
        time.sleep(1)
        
        # Preencher datas novamente
        self.set_datetime("periodoInicio", "2025-02-10T08:30")
        self.set_datetime("periodoFim", "2025-03-10T18:00")
        time.sleep(1)

        # Salvar edição
        wait.until(
            EC.element_to_be_clickable(
                (By.XPATH, "//div[@id='periodoModal']//button[contains(text(),'Salvar')]")
            )
        ).click()
        
        # Validar que a descrição atualizada aparece na tabela
        wait.until(lambda d: "Período editado via Selenium." in d.find_element(By.ID, "periodoTable").get_attribute("innerHTML"))
        wait.until(lambda d: "Período criado via Selenium." not in d.find_element(By.ID, "periodoTable").get_attribute("innerHTML"))


        wait.until(EC.invisibility_of_element_located((By.ID, "periodoModal")))
        time.sleep(1)

        # === EXCLUIR PERÍODO ===
        wait.until(lambda d: len(d.find_elements(By.XPATH, "//button[contains(@onclick,'deletePeriodo')]")) > 0)
        btns_excluir = driver.find_elements(By.XPATH, "//button[contains(@onclick,'deletePeriodo')]")
        btns_excluir[-1].click()
        time.sleep(1)

        alert = wait.until(EC.alert_is_present())
        time.sleep(0.5)
        alert.accept()

        time.sleep(1)

        print("\n✔ CRUD de Período de Avaliação executado com sucesso!\n")


if __name__ == "__main__":
    unittest.main()

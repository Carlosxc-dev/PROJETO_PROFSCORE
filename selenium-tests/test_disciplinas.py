import unittest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class TestCRUDDisciplinas(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.maximize_window()
        self.wait = WebDriverWait(self.driver, 10)
        self.driver.get("http://127.0.0.1:5500/frontend/index.html#")

    def tearDown(self):
        self.driver.quit()

    def test_crud_disciplinas(self):
        driver = self.driver
        wait = self.wait

        # === LOGIN ===
        wait.until(EC.visibility_of_element_located((By.ID, "loginEmail"))).send_keys("admin@admin.com")
        wait.until(EC.visibility_of_element_located((By.ID, "loginPassword"))).send_keys("1234567")
        wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button[type='submit']"))).click()
        wait.until(EC.visibility_of_element_located((By.ID, "dashboard")))
        time.sleep(1)

        # === ABRIR CRUD DISCIPLINAS ===
        wait.until(EC.element_to_be_clickable(
            (By.CSS_SELECTOR, ".menu-card[onclick=\"showSection('disciplinas')\"]")
        )).click()
        wait.until(EC.visibility_of_element_located((By.ID, "disciplinasSection")))
        time.sleep(1)

        # === CLICAR EM + NOVA DISCIPLINA ===
        btn_novo = wait.until(
            EC.presence_of_element_located((By.XPATH, "//button[contains(text(),'+ Nova Disciplina')]"))
        )
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", btn_novo)
        wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'+ Nova Disciplina')]")))
        btn_novo.click()

        # === PREENCHER FORMULÁRIO ===
        wait.until(EC.visibility_of_element_located((By.ID, "disciplinaSigla"))).send_keys("TST1")
        time.sleep(1)
        wait.until(EC.visibility_of_element_located((By.ID, "disciplinaNome"))).send_keys("Teste Selenium Disciplina")
        time.sleep(1)
        wait.until(EC.visibility_of_element_located((By.ID, "disciplinaPeriodo"))).send_keys("Noturno")
        time.sleep(1)
        wait.until(EC.visibility_of_element_located((By.ID, "disciplinaSemestre"))).send_keys("2025")
        time.sleep(1)
        # Professor (seleção da 2ª opção válida)
        select_prof = wait.until(EC.visibility_of_element_located((By.ID, "disciplinaProfessorId")))
        select_prof.click()
        time.sleep(1)
        driver.find_element(By.XPATH, "//select[@id='disciplinaProfessorId']/option[2]").click()
        time.sleep(1)
        # Salvar
        wait.until(EC.element_to_be_clickable(
            (By.XPATH, "//div[@id='disciplinaModal']//button[contains(text(),'Salvar')]")
        )).click()

        wait.until(EC.invisibility_of_element_located((By.ID, "disciplinaModal")))
        time.sleep(1)

        # === EDITAR A DISCIPLINA ===
        wait.until(lambda d: len(d.find_elements(By.XPATH, "//button[contains(@onclick,'editDisciplina')]")) > 0)
        btns_editar = driver.find_elements(By.XPATH, "//button[contains(@onclick,'editDisciplina')]")
        btns_editar[-1].click()
        time.sleep(1)

        campo_nome = wait.until(EC.visibility_of_element_located((By.ID, "disciplinaNome")))
        time.sleep(1)
        campo_nome.clear()
        time.sleep(1)
        campo_nome.send_keys("Disciplina Selenium Editada")
        time.sleep(1)

        # === selecionar novamente o professor (obrigatório) ===
        select_prof = wait.until(EC.visibility_of_element_located((By.ID, "disciplinaProfessorId")))
        select_prof.click()
        time.sleep(1)

        # Seleciona a 2ª opção válida (ou ajuste se quiser outra)
        driver.find_element(
            By.XPATH, "//select[@id='disciplinaProfessorId']/option[2]"
        ).click()
        time.sleep(1)

        # === SALVAR ===
        wait.until(EC.element_to_be_clickable(
            (By.XPATH, "//div[@id='disciplinaModal']//button[contains(text(),'Salvar')]")
        )).click()

        wait.until(EC.invisibility_of_element_located((By.ID, "disciplinaModal")))
        time.sleep(1)


        # === EXCLUIR ===
        wait.until(lambda d: len(d.find_elements(By.XPATH, "//button[contains(@onclick,'deleteDisciplina')]")) > 0)
        btns_excluir = driver.find_elements(By.XPATH, "//button[contains(@onclick,'deleteDisciplina')]")
        btns_excluir[-1].click()
        time.sleep(1)
        alerta = wait.until(EC.alert_is_present())
        time.sleep(1)
        alerta.accept()
        time.sleep(2)
        wait.until_not(lambda d: "Disciplina Selenium Editada" in d.find_element(By.ID, "disciplinasTable").get_attribute("innerHTML"))
        time.sleep(1)
        print("\n✔ CRUD de Disciplinas executado com sucesso!\n")


if __name__ == "__main__":
    unittest.main()

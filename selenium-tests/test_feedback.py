import unittest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class TestCRUDFeedback(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.maximize_window()
        self.wait = WebDriverWait(self.driver, 10)
        self.driver.get("http://127.0.0.1:5500/frontend/index.html#")

    def tearDown(self):
        self.driver.quit()

    def test_crud_feedback(self):
        driver = self.driver
        wait = self.wait

        # === LOGIN ===
        wait.until(EC.visibility_of_element_located((By.ID, "loginEmail"))).send_keys("admin@admin.com")
        wait.until(EC.visibility_of_element_located((By.ID, "loginPassword"))).send_keys("1234567")
        wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button[type='submit']"))).click()
        wait.until(EC.visibility_of_element_located((By.ID, "dashboard")))
        time.sleep(1)

        # === ABRIR FEEDBACK ===
        wait.until(EC.element_to_be_clickable(
            (By.CSS_SELECTOR, ".menu-card[onclick=\"showSection('feedback')\"]")
        )).click()

        wait.until(EC.visibility_of_element_located((By.ID, "feedbackSection")))
        time.sleep(1)

        # === NOVO FEEDBACK ===
        btn_novo = wait.until(
            EC.presence_of_element_located((By.XPATH, "//button[contains(text(),'+ Novo Feedback')]"))
        )
        driver.execute_script("arguments[0].scrollIntoView({block:'center'});", btn_novo)
        btn_novo.click()

        # Carregar selects
        wait.until(EC.visibility_of_element_located((By.ID, "feedbackAlunoId")))
        wait.until(EC.visibility_of_element_located((By.ID, "feedbackProfessorId")))
        wait.until(EC.visibility_of_element_located((By.ID, "feedbackDisciplinaId")))
        time.sleep(1)

        # === Selecionar itens ===
        driver.find_element(By.XPATH, "//select[@id='feedbackAlunoId']/option[2]").click()
        time.sleep(1)

        driver.find_element(By.XPATH, "//select[@id='feedbackProfessorId']/option[2]").click()
        time.sleep(1)

        driver.find_element(By.XPATH, "//select[@id='feedbackDisciplinaId']/option[2]").click()
        time.sleep(1)

        # Comentário
        driver.find_element(By.ID, "feedbackTexto").send_keys("Feedback criado via Selenium.")
        time.sleep(1)

        # === SALVAR ===
        wait.until(EC.element_to_be_clickable(
            (By.XPATH, "//div[@id='feedbackModal']//button[contains(text(),'Salvar')]")
        )).click()

        wait.until(EC.invisibility_of_element_located((By.ID, "feedbackModal")))
        time.sleep(1)

        # === EDITAR ===
        wait.until(lambda d: len(d.find_elements(By.XPATH, "//button[contains(@onclick,'editFeedback')]")) > 0)
        botoes = driver.find_elements(By.XPATH, "//button[contains(@onclick,'editFeedback')]")
        botoes[-1].click()

        time.sleep(1)

        # === Selecionar novamente aluno, professor e disciplina ===
        wait.until(EC.visibility_of_element_located((By.ID, "feedbackAlunoId")))
        wait.until(EC.visibility_of_element_located((By.ID, "feedbackProfessorId")))
        wait.until(EC.visibility_of_element_located((By.ID, "feedbackDisciplinaId")))

        # Selecionar Aluno
        driver.find_element(By.XPATH, "//select[@id='feedbackAlunoId']/option[2]").click()
        time.sleep(1)

        # Selecionar Professor
        driver.find_element(By.XPATH, "//select[@id='feedbackProfessorId']/option[2]").click()
        time.sleep(1)

        # Selecionar Disciplina
        driver.find_element(By.XPATH, "//select[@id='feedbackDisciplinaId']/option[2]").click()
        time.sleep(1)

        
        comentario = wait.until(EC.visibility_of_element_located((By.ID, "feedbackTexto")))
        comentario.clear()
        comentario.send_keys("Feedback editado via Selenium.")
        time.sleep(1)

        wait.until(EC.element_to_be_clickable(
            (By.XPATH, "//div[@id='feedbackModal']//button[contains(text(),'Salvar')]")
        )).click()

        wait.until(EC.invisibility_of_element_located((By.ID, "feedbackModal")))
        time.sleep(1)

        # === EXCLUIR ===
        wait.until(lambda d: len(
            d.find_elements(By.XPATH, "//button[contains(@onclick,'deleteFeedback')]")
        ) > 0)

        btn_delete = driver.find_elements(By.XPATH, "//button[contains(@onclick,'deleteFeedback')]")
        btn_delete[-1].click()

        time.sleep(1)
        alerta = wait.until(EC.alert_is_present())
        alerta.accept()
        time.sleep(1)

        print("\n✔ CRUD de Feedback executado com sucesso!\n")


if __name__ == "__main__":
    unittest.main()

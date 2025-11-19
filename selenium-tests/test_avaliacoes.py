import unittest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class TestCRUDAvaliacoes(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.maximize_window()
        self.wait = WebDriverWait(self.driver, 10)
        self.driver.get("http://127.0.0.1:5500/frontend/index.html#")

    def tearDown(self):
        self.driver.quit()

    def test_crud_avaliacoes(self):
        driver = self.driver
        wait = self.wait

        # === LOGIN ===
        wait.until(EC.visibility_of_element_located((By.ID, "loginEmail"))).send_keys("admin@admin.com")
        wait.until(EC.visibility_of_element_located((By.ID, "loginPassword"))).send_keys("1234567")
        wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button[type='submit']"))).click()
        wait.until(EC.visibility_of_element_located((By.ID, "dashboard")))
        time.sleep(1)

        # === ABRIR AVALIAÇÕES ===
        wait.until(EC.element_to_be_clickable(
            (By.CSS_SELECTOR, ".menu-card[onclick=\"showSection('avaliacoes')\"]")
        )).click()
        wait.until(EC.visibility_of_element_located((By.ID, "avaliacoesSection")))
        time.sleep(1)

        # === NOVA AVALIAÇÃO ===
        btn_novo = wait.until(
            EC.presence_of_element_located((By.XPATH, "//button[contains(text(),'+ Nova Avaliação')]"))
        )
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", btn_novo)
        btn_novo.click()

        # Carregar selects
        time.sleep(1)
        wait.until(EC.visibility_of_element_located((By.ID, "avaliacaoAlunoId")))
        wait.until(EC.visibility_of_element_located((By.ID, "avaliacaoProfessorId")))
        wait.until(EC.visibility_of_element_located((By.ID, "avaliacaoDisciplinaId")))
        time.sleep(1)
        # Selecionar aluno
        driver.find_element(By.XPATH, "//select[@id='avaliacaoAlunoId']/option[2]").click()
        time.sleep(1)
        # Selecionar professor
        driver.find_element(By.XPATH, "//select[@id='avaliacaoProfessorId']/option[2]").click()
        time.sleep(1)
        # Selecionar disciplina
        driver.find_element(By.XPATH, "//select[@id='avaliacaoDisciplinaId']/option[2]").click()
        time.sleep(1)

        # Preencher notas
        driver.find_element(By.ID, "avaliacaoMetodologia").send_keys("4")
        time.sleep(1)
        driver.find_element(By.ID, "avaliacaoClareza").send_keys("5")
        time.sleep(1)
        driver.find_element(By.ID, "avaliacaoAssiduidade").send_keys("4")
        time.sleep(1)
        driver.find_element(By.ID, "avaliacaoDidatica").send_keys("5")
        time.sleep(1)
        driver.find_element(By.ID, "avaliacaoComentario").send_keys("Avaliação criada via Selenium.")
        time.sleep(1)

        # Salvar
        wait.until(EC.element_to_be_clickable((By.XPATH, "//div[@id='avaliacaoModal']//button[contains(text(),'Salvar')]"))).click()
        wait.until(EC.invisibility_of_element_located((By.ID, "avaliacaoModal")))
        time.sleep(1)

        # === EDITAR ===
        wait.until(lambda d: len(d.find_elements(By.XPATH, "//button[contains(@onclick,'editAvaliacao')]")) > 0)
        btns_editar = driver.find_elements(By.XPATH, "//button[contains(@onclick,'editAvaliacao')]")
        btns_editar[-1].click()

        time.sleep(1)

        # === Selecionar novamente aluno, professor e disciplina (obrigatório) ===
        wait.until(EC.visibility_of_element_located((By.ID, "avaliacaoAlunoId")))
        wait.until(EC.visibility_of_element_located((By.ID, "avaliacaoProfessorId")))
        wait.until(EC.visibility_of_element_located((By.ID, "avaliacaoDisciplinaId")))

        # Selecionar Aluno
        driver.find_element(By.XPATH, "//select[@id='avaliacaoAlunoId']/option[2]").click()
        time.sleep(1)

        # Selecionar Professor
        driver.find_element(By.XPATH, "//select[@id='avaliacaoProfessorId']/option[2]").click()
        time.sleep(1)

        # Selecionar Disciplina
        driver.find_element(By.XPATH, "//select[@id='avaliacaoDisciplinaId']/option[2]").click()
        time.sleep(1)

        # === Editar comentário ===
        comentario = wait.until(EC.visibility_of_element_located((By.ID, "avaliacaoComentario")))
        comentario.clear()
        comentario.send_keys("Avaliação editada via Selenium.")
        time.sleep(1)

        # === SALVAR ===
        wait.until(EC.element_to_be_clickable(
            (By.XPATH, "//div[@id='avaliacaoModal']//button[contains(text(),'Salvar')]")
        )).click()

        wait.until(EC.invisibility_of_element_located((By.ID, "avaliacaoModal")))
        time.sleep(1)

        # === EXCLUIR ===
        wait.until(lambda d: len(d.find_elements(By.XPATH, "//button[contains(@onclick,'deleteAvaliacao')]")) > 0)
        btns_excluir = driver.find_elements(By.XPATH, "//button[contains(@onclick,'deleteAvaliacao')]")
        btns_excluir[-1].click()
        time.sleep(1)
        alerta = wait.until(EC.alert_is_present())
        time.sleep(1)
        alerta.accept()
        time.sleep(1)
        wait.until(lambda d: "Avaliação editada via Selenium." not in d.find_element(By.ID, "avaliacoesTable").get_attribute("innerHTML"))

        print("\n✔ CRUD de Avaliações executado com sucesso!\n")


if __name__ == "__main__":
    unittest.main()

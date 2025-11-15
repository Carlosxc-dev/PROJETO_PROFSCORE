import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
import time


class TestCRUDProfessores(unittest.TestCase):

    def setUp(self):
        service = Service()
        self.driver = webdriver.Chrome(service=service)
        self.driver.maximize_window()
        self.wait = WebDriverWait(self.driver, 10)

    def tearDown(self):
        self.driver.quit()

    def test_crud_professores(self):
        driver = self.driver
        wait = self.wait

        # --------------------------
        # LOGIN
        # --------------------------
        driver.get("http://127.0.0.1:5500/frontend/index.html")

        wait.until(EC.visibility_of_element_located((By.ID, "loginEmail"))).send_keys("admin@admin.com")
        time.sleep(1)
        driver.find_element(By.ID, "loginPassword").send_keys("1234567")
        time.sleep(1)
        driver.find_element(By.CSS_SELECTOR, "button.btn-primary").click()

        wait.until(EC.visibility_of_element_located((By.ID, "dashboard")))

        # --------------------------
        # ABRIR SEÇÃO PROFESSORES
        # --------------------------
        time.sleep(1)
        btn_menu_professores = wait.until(
            EC.element_to_be_clickable((By.XPATH, "//div[contains(@class,'menu-card')][.//h3='Professores']"))
        )
        btn_menu_professores.click()

        wait.until(EC.visibility_of_element_located((By.ID, "professoresTable")))
        time.sleep(1)
        # --------------------------
        # CRIAR PROFESSOR
        # --------------------------
        # Abre o modal
        btn_novo = wait.until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'+ Novo Professor')]"))
        )
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", btn_novo)
        btn_novo.click()

        # Espera modal abrir
        modal_professor = wait.until(
            EC.visibility_of_element_located((By.ID, "professorModal"))
        )

        # Preenche formulário
        campo_nome = wait.until(EC.visibility_of_element_located((By.ID, "professorNome")))
        campo_nome.send_keys("Professor Teste 2")
        time.sleep(1)
        campo_dep = wait.until(EC.visibility_of_element_located((By.ID, "professorDepartamento")))
        campo_dep.send_keys("Computação")
        time.sleep(1)
        campo_email = wait.until(EC.visibility_of_element_located((By.ID, "professorEmail")))
        campo_email.send_keys("prof_selenium2@test.com")
        time.sleep(1)
        # Captura o nome realmente digitado
        nome_prof = campo_nome.get_attribute("value")

        # Salva
        btn_salvar = wait.until(
            EC.element_to_be_clickable((By.XPATH, "//div[@id='professorModal']//button[contains(text(),'Salvar')]"))
        )
        driver.execute_script("arguments[0].scrollIntoView({block:'center'});", btn_salvar)
        btn_salvar.click()

        # Aguarda recarregar tabela
        time.sleep(1)
        tabela = driver.find_element(By.ID, "professoresTable").get_attribute("innerHTML")

        # Validação automática
        self.assertIn(nome_prof, tabela)
        # --------------------------
        # EDITAR PROFESSOR
        # --------------------------
        # === ENCONTRA A LINHA DO PROFESSOR CRIADO ===
        linha_professor = wait.until(
            EC.visibility_of_element_located((
                By.XPATH,
                f"//tbody[@id='professoresTable']//tr[td[contains(text(), '{nome_prof}')]]"
            ))
        )

        # BOTÃO EDITAR da linha correta
        btn_editar = linha_professor.find_element(By.XPATH, ".//button[contains(text(),'✏️')]")
        driver.execute_script("arguments[0].scrollIntoView({block:'center'});", btn_editar)
        btn_editar.click()

        # === EDITA CAMPOS ===
        campo_nome = wait.until(EC.visibility_of_element_located((By.ID, "professorNome")))
        campo_nome.clear()
        campo_nome.send_keys("Professor Selenium Editado")
        novo_nome = campo_nome.get_attribute("value")

        # Salva após edição
        btn_salvar = wait.until(
            EC.element_to_be_clickable((
                By.XPATH,
                "//div[@id='professorModal']//button[contains(text(),'Salvar')]"
            ))
        )
        driver.execute_script("arguments[0].scrollIntoView({block:'center'});", btn_salvar)
        btn_salvar.click()

        # Força recarregar lista de professores
        driver.execute_script("showSection('professores');")
        time.sleep(1)

        # Verifica se o nome editado aparece na tabela
        tabela = driver.find_element(By.ID, "professoresTable").get_attribute("innerHTML")
        self.assertIn(novo_nome, tabela)



        # --------------------------
        # EXCLUIR PROFESSOR
        # --------------------------
        linha_professor = wait.until(
            EC.visibility_of_element_located((
                By.XPATH,
                f"//tbody[@id='professoresTable']//tr[td[contains(text(), '{novo_nome}')]]"
            ))
        )

        # Encontra o botão de excluir dentro da linha
        btn_excluir = linha_professor.find_element(
            By.XPATH,
            ".//button[contains(text(),'🗑️')]"
        )

        # Garante que o botão está visível na tela
        driver.execute_script("arguments[0].scrollIntoView({block:'center'});", btn_excluir)

        # Clica no botão correto
        btn_excluir.click()

        # Aceita o alerta de confirmação
        alerta = wait.until(EC.alert_is_present())
        alerta.accept()

        # Espera a tabela atualizar
        time.sleep(1)
        tabela = driver.find_element(By.ID, "professoresTable").get_attribute("innerHTML")

        # Verifica remoção
        self.assertNotIn(novo_nome, tabela)



if __name__ == "__main__":
    unittest.main()

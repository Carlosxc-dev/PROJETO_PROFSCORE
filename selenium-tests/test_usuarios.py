import unittest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class TestCRUDUsuarios(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.maximize_window()
        self.wait = WebDriverWait(self.driver, 10)
        self.driver.get("http://127.0.0.1:5500/frontend/index.html#")

    def tearDown(self):
        self.driver.quit()

    def test_crud_usuarios(self):
        driver = self.driver
        wait = self.wait

        # === LOGIN ===
        wait.until(EC.visibility_of_element_located((By.ID, "loginEmail"))).send_keys("admin@admin.com")
        time.sleep(1)
        wait.until(EC.visibility_of_element_located((By.ID, "loginPassword"))).send_keys("1234567")
        time.sleep(1)
        wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button[type='submit']"))).click()

        # Espera dashboard aparecer
        wait.until(EC.visibility_of_element_located((By.ID, "dashboard")))
        time.sleep(1)
        # === ABRIR CRUD USUÁRIOS ===
        wait.until(EC.element_to_be_clickable(
            (By.CSS_SELECTOR, ".menu-card[onclick=\"showSection('usuarios')\"]")
        )).click()
        time.sleep(1)
        # A seção real tem ID "usuariosSection"
        wait.until(EC.visibility_of_element_located((By.ID, "usuariosSection")))
        # Rolando até o botão + Novo Usuário
        

        # === CLICAR EM + NOVO USUÁRIO ===
        btn_novo = wait.until(
            EC.presence_of_element_located((By.XPATH, "//button[contains(text(),'+ Novo Usuário')]"))
        )

        # Impede interceptação do click
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", btn_novo)
        wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'+ Novo Usuário')]")))

        btn_novo.click()

        # === PREENCHER FORMULÁRIO DE CRIAÇÃO ===
        wait.until(EC.visibility_of_element_located((By.ID, "usuarioNome"))).send_keys("Teste Selenium 2")
        time.sleep(1)
        wait.until(EC.visibility_of_element_located((By.ID, "usuarioEmail"))).send_keys("selenium2@teste.com")
        time.sleep(1)
        wait.until(EC.visibility_of_element_located((By.ID, "usuarioSenha"))).send_keys("123456")
        time.sleep(1)
        wait.until(EC.visibility_of_element_located((By.ID, "usuarioPerfil"))).send_keys("ALUNO")
        time.sleep(1)
        wait.until(EC.visibility_of_element_located((By.ID, "usuarioStatus"))).send_keys("ATIVO")

        # SALVAR
        wait.until(EC.element_to_be_clickable(
            (By.XPATH, "//button[contains(text(),'Salvar')]")
        )).click()

        # === FECHAR MODAL ===
        wait.until(EC.element_to_be_clickable(
            (By.CSS_SELECTOR, "#usuarioModal .close-modal")
        )).click()

        wait.until(EC.invisibility_of_element_located((By.ID, "usuarioModal")))

        # Aguarda tabela atualizar
        time.sleep(1)

        # Aguarda a tabela recarregar e os botões aparecerem
        wait.until(lambda d: len(d.find_elements(By.XPATH, "//button[contains(@onclick,'editUsuario')]")) > 0)

        # Seleciona o último botão (do usuário recém criado)
        btns_editar = driver.find_elements(By.XPATH, "//button[contains(@onclick,'editUsuario')]")
        btns_editar[-1].click()

        # === EDITAR NOME ===
        campo_nome = wait.until(EC.visibility_of_element_located((By.ID, "usuarioNome")))
        time.sleep(1)
        campo_nome.clear()
        time.sleep(1)
        campo_nome.send_keys("Teste Selenium Editado")
        time.sleep(1)
        
        # SALVAR
        wait.until(EC.element_to_be_clickable(
            (By.XPATH, "//button[contains(text(),'Salvar')]")
        )).click()

        # FECHAR MODAL
        wait.until(EC.element_to_be_clickable(
            (By.CSS_SELECTOR, "#usuarioModal .close-modal")
        )).click()
        wait.until(EC.invisibility_of_element_located((By.ID, "usuarioModal")))
        time.sleep(1)

        # === EXCLUIR ===
        # Espera todos os botões de excluir estarem carregados
        wait.until(lambda d: len(d.find_elements(By.XPATH, "//button[contains(@onclick,'deleteUsuario')]")) > 0)

        btns_excluir = driver.find_elements(By.XPATH, "//button[contains(@onclick,'deleteUsuario')]")

        # Clica no último botão (do usuário recém criado/editado)
        btns_excluir[-1].click()

        # O alerta aparece — Selenium precisa lidar com ele antes de qualquer outra ação
        alerta = wait.until(EC.alert_is_present())
        alerta.accept()

        # Esperar a tabela atualizar depois que o backend deletar o usuário
        wait.until_not(lambda d: "Teste Selenium Editado" in d.find_element(By.ID, "usuariosTable").get_attribute("innerHTML"))


        print("\n✔ CRUD de Usuários executado com sucesso!\n")


if __name__ == "__main__":
    unittest.main()

import unittest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
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

        novo_nome = "Teste Selenium 3"
        novo_email = "selenium3@teste.com"
        nome_editado = "Teste Selenium Editado 3"

        # =========================
        # LOGIN
        # =========================
        wait.until(EC.visibility_of_element_located((By.ID, "loginEmail"))).send_keys("admin@admin.com")
        time.sleep(1)
        wait.until(EC.visibility_of_element_located((By.ID, "loginPassword"))).send_keys("1234567")
        time.sleep(1)
        wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button[type='submit']"))).click()

        wait.until(EC.visibility_of_element_located((By.ID, "dashboard")))
        time.sleep(1)

        # =========================
        # ABRIR CRUD USUÁRIOS
        # =========================
        wait.until(EC.element_to_be_clickable(
            (By.CSS_SELECTOR, ".menu-card[onclick=\"showSection('usuarios')\"]")
        )).click()

        wait.until(EC.visibility_of_element_located((By.ID, "usuariosSection")))
        time.sleep(1)

        # =========================
        # CLICAR EM + NOVO USUÁRIO
        # =========================
        btn_novo = wait.until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'+ Novo Usuário')]"))
        )
        driver.execute_script("arguments[0].scrollIntoView({block:'center'});", btn_novo)
        btn_novo.click()

        # =========================
        # CRIAR NOVO USUÁRIO
        # =========================
        wait.until(EC.visibility_of_element_located((By.ID, "usuarioNome"))).send_keys(novo_nome)
        time.sleep(1)
        wait.until(EC.visibility_of_element_located((By.ID, "usuarioEmail"))).send_keys(novo_email)
        time.sleep(1)
        wait.until(EC.visibility_of_element_located((By.ID, "usuarioSenha"))).send_keys("teste@12")
        time.sleep(1)
        wait.until(EC.visibility_of_element_located((By.ID, "usuarioPerfil"))).send_keys("ALUNO")
        time.sleep(1)
        wait.until(EC.visibility_of_element_located((By.ID, "usuarioStatus"))).send_keys("ATIVO")
        time.sleep(1)

        wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Salvar')]"))).click()

        # FECHAR MODAL VIA JS (melhor para evitar interceptação)
        driver.execute_script("closeUsuarioModal()")
        wait.until(EC.invisibility_of_element_located((By.ID, "usuarioModal")))
        time.sleep(1)

        # =========================
        # ENCONTRAR A LINHA DO USUÁRIO CRIADO (PELO EMAIL)
        # =========================
        linha = wait.until(EC.visibility_of_element_located((
            By.XPATH,
            f"//tbody[@id='usuariosTable']//tr[td[contains(text(), '{novo_email}')]]"
        )))

        # =========================
        # EDITAR O USUÁRIO CRIADO
        # =========================
        btn_editar = linha.find_element(By.XPATH, ".//button[contains(@onclick,'editUsuario')]")
        driver.execute_script("arguments[0].scrollIntoView({block:'center'});", btn_editar)
        time.sleep(0.5)
        btn_editar.click()

        campo_nome = wait.until(EC.visibility_of_element_located((By.ID, "usuarioNome")))
        time.sleep(1)
        campo_nome.clear()
        time.sleep(1)
        campo_nome.send_keys(nome_editado)
        time.sleep(1)

        wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Salvar')]"))).click()

        driver.execute_script("closeUsuarioModal()")
        wait.until(EC.invisibility_of_element_located((By.ID, "usuarioModal")))
        time.sleep(1)

        # =========================
        # PEGAR LINHA NOVAMENTE (AGORA COM O NOME EDITADO)
        # =========================
        linha_editada = wait.until(EC.visibility_of_element_located((
            By.XPATH,
            f"//tbody[@id='usuariosTable']//tr[td[contains(text(), '{nome_editado}')]]"
        )))

        # =========================
        # EXCLUIR O USUÁRIO CRIADO
        # =========================
        btn_excluir = linha_editada.find_element(By.XPATH, ".//button[contains(@onclick,'deleteUsuario')]")
        driver.execute_script("arguments[0].scrollIntoView({block:'center'});", btn_excluir)
        time.sleep(0.5)
        btn_excluir.click()
        time.sleep(1)
        alerta = wait.until(EC.alert_is_present())
        time.sleep(1)
        alerta.accept()

        time.sleep(1)

        # =========================
        # VALIDAR REMOÇÃO
        # =========================
        tabela = driver.find_element(By.ID, "usuariosTable").get_attribute("innerHTML")
        self.assertNotIn(nome_editado, tabela)

        print("\n✔ CRUD de Usuários executado COM SUCESSO!\n")


if __name__ == "__main__":
    unittest.main()

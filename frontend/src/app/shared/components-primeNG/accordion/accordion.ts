import { Component } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-accordion',
	imports: [AccordionModule, CommonModule],
	templateUrl: './accordion.html',
	styleUrl: './accordion.css',
	standalone: true,
})
export class Accordion {
	questions = {
		question1: 'Como fazer upload de uma pasta de imagens ?',
		question2: 'Como ver os resultados de um upload ?',
		question3: 'Como cadastrar um novo usuario no sistema ?',
		question4: 'Como cadastrar uma nova Fazenda no sistema ?',
		question5: 'Como editar ou excluir um usuario cadastrado ?',
		question6: 'Como editar ou excluir uma Fazenda cadastrada ?',
	};

	answers = {
		answer1: `<ol>
		<li>Clique no menu lateral em <strong>"Upload de Imagens"</strong>.</li>
		<li>Clique no botão <strong>"Selecionar Pasta"</strong> e escolha a pasta desejada.</li>
		<li>Após selecionar a pasta, clique no botão <strong>"Iniciar Upload"</strong> para começar o processo.</li>
	</ol>`,

		answer2: `<ol>
		<li>Clique no menu lateral em <strong>"Resultados de Upload"</strong>.</li>
		<li>Veja a lista dos uploads recentes com detalhes como data, número de imagens e status.</li>
		<li>Clique em um upload específico para ver mais informações.</li>
	</ol>`,

		answer3: `<ol>
		<li>No menu lateral, clique em <strong>"Gerenciamento de Usuários"</strong>.</li>
		<li>Clique no botão <strong>"Adicionar Novo Usuário"</strong>.</li>
		<li>Preencha o formulário com as informações necessárias e clique em <strong>"Salvar"</strong>.</li>
	</ol>`,

		answer4: `<ol>
		<li>Acesse o menu lateral e selecione <strong>"Gerenciamento de Fazendas"</strong>.</li>
		<li>Clique no botão <strong>"Adicionar Nova Fazenda"</strong>.</li>
		<li>Preencha os detalhes da fazenda no formulário e clique em <strong>"Salvar"</strong> para concluir o cadastro.</li>
	</ol>`,

		answer5: `<ol>
		<li>No menu lateral, clique em <strong>"Gerenciamento de Usuários"</strong>.</li>
		<li>Encontre o usuário que deseja modificar na lista.</li>
		<li>Clique no ícone de <strong>edição</strong> para alterar as informações ou no ícone de <strong>exclusão</strong> para remover o usuário do sistema.</li>
	</ol>`,

		answer6: `<ol>
		<li>Acesse o menu lateral e clique em <strong>"Gerenciamento de Fazendas"</strong>.</li>
		<li>Localize a fazenda que deseja modificar na lista.</li>
		<li>Clique no ícone de <strong>edição</strong> para atualizar os detalhes ou no ícone de <strong>exclusão</strong> para remover a fazenda do sistema.</li>
	</ol>`,
	};

	tabs = [
		{
			title: this.questions.question1,
			content: this.answers.answer1,
			value: '0',
		},
		{
			title: this.questions.question2,
			content: this.answers.answer2,
			value: '1',
		},
		{
			title: this.questions.question3,
			content: this.answers.answer3,
			value: '2',
		},
		{
			title: this.questions.question4,
			content: this.answers.answer4,
			value: '3',
		},
		{
			title: this.questions.question5,
			content: this.answers.answer5,
			value: '4',
		},
		{
			title: this.questions.question6,
			content: this.answers.answer6,
			value: '5',
		},
	];
}

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
		question3: 'Como cadastrar um novo usuario no sistema ?',
		question5: 'Como editar ou excluir um usuario cadastrado ?',
	};

	answers = {
		answer3: `<ol>
		<li>No menu lateral, clique em <strong>"Gerenciamento de Usuários"</strong>.</li>
		<li>Clique no botão <strong>"Adicionar Novo Usuário"</strong>.</li>
		<li>Preencha o formulário com as informações necessárias e clique em <strong>"Salvar"</strong>.</li>
	</ol>`,

		answer5: `<ol>
		<li>No menu lateral, clique em <strong>"Gerenciamento de Usuários"</strong>.</li>
		<li>Encontre o usuário que deseja modificar na lista.</li>
		<li>Clique no ícone de <strong>edição</strong> para alterar as informações ou no ícone de <strong>exclusão</strong> para remover o usuário do sistema.</li>
	</ol>`,
	};

	tabs = [
		{
			title: this.questions.question3,
			content: this.answers.answer3,
			value: '2',
		},
		{
			title: this.questions.question5,
			content: this.answers.answer5,
			value: '4',
		},
	];
}

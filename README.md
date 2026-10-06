# Engenharia de Software 2026.2

Landing page da turma de Engenharia de Software, 5º semestre, turno da tarde, ingresso em 2024. O período letivo é o 2026.2.

A página apresenta a sala, os professores, os alunos e as disciplinas deste semestre.

## Sobre

A turma ingressou em 2024 e hoje cursa o 5º semestre no turno da tarde. Neste período a sala percorre arquitetura de software, gerência de projetos, processos de desenvolvimento, redes de computadores e robótica móvel.

Na página, a seção **Sobre** reúne esse texto e os contadores de alunos, professores e disciplinas.

## Alunos

São 16 alunos, exibidos em duas filas e em ordem alfabética. A fila de cima anda para a esquerda e a de baixo para a direita.

- Cybele Isabela dos Santos Silva
- Gustavo Neves Coelho
- Hanrry Julio Araujo Santos
- Hortencia Gomes Silva
- Igo Roberth Costa Martins
- Ikki Silva Carvalho
- Israel Martins de Moura Barros
- Italo Dannyel Silva da Silva
- Jose Gomes Cabral Neto
- Lucas Daniel Brito Queiroz
- Lucas Henrique Oliveira Souza
- Luiz Felipe Meneses Ferreira
- Mauricio Araujo Lucas
- Nicolas Gabriel Cunha de Sousa
- Saylon da Rocha Batista
- Vitoria Mota Ribas

A página mostra apenas o nome. Matrícula, usuário e e-mail pessoal ficam de fora.

## Professores

Um card por vez, com foto (ou as iniciais, enquanto não houver imagem) e um resumo. As setas nas laterais trocam o professor.

| Professor | Disciplina |
| --- | --- |
| Jacqueline Cristina Teixeira do Rosario | Arquitetura de Software e Gerência de Projetos |
| Alan Cloves Silva Barreto | Fundamentos de Redes de Computadores |
| Vanessa Castro Rezende | Processos de Desenvolvimento de Software |
| Keny Lucas da Silva Goes | Robótica Móvel |

Para incluir a foto, preencha o campo `foto` do professor em `js/main.js` com o caminho da imagem.

## Disciplinas

Grade do 5º semestre, turno da tarde:

- Arquitetura de Software
- Gerência de Projetos
- Fundamentos de Redes de Computadores
- Processos de Desenvolvimento de Software
- Robótica Móvel

## Contato

O e-mail que aparece no rodapé ainda é provisório: [contato@exemplo.com](mailto:contato@exemplo.com). Troque pelo endereço real da turma em `index.html`.

## Estrutura do projeto

```
/
├── index.html      # Página principal
├── css/
│   └── style.css   # Estilos da página
├── js/
│   └── main.js     # Dados da turma e scripts
└── README.md
```

## Como editar

Nomes, resumos e disciplinas ficam no objeto `TURMA`, no início de `js/main.js`. Textos fixos da abertura, do menu e do rodapé ficam em `index.html`.

## Tecnologias

- HTML5
- CSS3
- JavaScript (vanilla)

## Como visualizar

Abra o arquivo `index.html` no navegador, ou use a extensão **Live Server** no editor.

---

# Documentação da Aplicação Task Manager

## Visão Geral

Este aplicativo é uma ferramenta poderosa projetada para ajudar os usuários a organizar suas tarefas diárias de forma eficiente e intuitiva. O Task Manager pode ser utilizado totalmente offline e em qualquer lugar, pois as tarefas são todas salvas localmente no dispositivo.

## Instalação e Configuração

1. Clone o repositório do GitHub:

   ```bash
   git clone https://github.com/adriancampana1/task-manager-app.git
   ```

2. Instale as dependências:

   ```bash
   cd task-manager
   npm install
   ```

3. Execute o aplicativo:

   - Para iniciar no emulador Android:

     ```bash
     npm run android
     ```

   - Para iniciar no emulador iOS:

     ```bash
     npm run ios
     ```

   - Para iniciar no navegador:

     ```bash
     npm run web
     ```
     

## Estrutura do Projeto

- **app**: Contém as telas e contextos da aplicação que serão renderizados.
- **assets**: Armazena imagens e fontes utilizadas na aplicação.
- **components**: Contém os componentes reutilizáveis da aplicação.
- **styles**: Define o tema geral de cores da aplicação.

## Navegação

A navegação na aplicação é feita utilizando `useRouter` do Expo para a navegação entre telas e Tabs para uma navegação tabular.

## Persistência de Dados

Este aplicativo utiliza o `AsyncStorage` para armazenar dados localmente, permitindo assim o uso do aplicativo offline.

## Tecnologias Principais

- **React Native**: Framework para construção de aplicativos móveis.
- **Expo**: Ferramenta para facilitar o desenvolvimento e a implantação de aplicativos React Native.
- **TypeScript**: Superset de JavaScript que adiciona tipagem estática ao código.
- **AsyncStorage**: Módulo React Native para armazenamento local de dados.
- **Jest**: Framework de teste para JavaScript.
- **React Navigation**: Biblioteca de roteamento e navegação para aplicativos React Native.

---

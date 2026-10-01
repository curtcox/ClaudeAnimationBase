---
id: the-router
title: "O roteador: o que há entre Curt e o modelo"
ch: 10
at: T49.C.01
links: [constitutional-classifiers, usage-policy, system-prompts, fable-mythos-5-1, {title: "Central de Transparência da Anthropic (em inglês)", url: "https://www.anthropic.com/transparency"}]
---
**O argumento de Curt.** Faça a pergunta errada sobre um incidente de invasão e "ela é marcada como risco de
cibersegurança e rejeitada, ou pelo menos rebaixada". Isso não é Claude de verdade, diz ele, "embora num sentido
minúsculo seja. É mais exatamente um roteador ativo entre nós."

**O que realmente existe ali.** Quando você usa Claude num app, sua mensagem não vai direto para um modelo e volta. Em
volta do modelo há outros programas, menores. Alguns são *classificadores*: programas treinados para identificar tipos
específicos de pedido, como ajuda com armas ou com invasão de computadores. A Anthropic escreveu sobre um tipo, os
[constitutional classifiers](https://www.anthropic.com/research/constitutional-classifiers) (em inglês), treinados a
partir de uma lista escrita do que é permitido e do que não é. Quando um deles dispara, o pedido pode ser recusado,
ajustado ou respondido por outro modelo (veja [Fable, Mythos e uma correção da correção](../fable-mythos/)).

**O que Claude consegue e não consegue ver.** No relato de Claude, um classificador que dispara pode acrescentar um
lembrete etiquetado à mensagem do usuário antes de Claude lê-la, cobrindo coisas como cibersegurança, ética, direitos
autorais, imagens ou conversas muito longas. Claude vê a etiqueta, mas não o raciocínio nem a pontuação do
classificador. E não vê nada do que acontece depois que responde: se a resposta dele é bloqueada ou marcada, ele nunca
fica sabendo. Então "do seu lado tudo parece 'Claude'", mas Claude é "um componente descrevendo o todo". É a mesma lição
da [correção da memória](../the-correction/): você está falando com um sistema.

**Algumas recusas são do próprio Claude.** Claude acrescenta que não ajudaria "a transformar um incidente num exploit que
funcione, seja qual for a camada que o pegue". Explicar o que aconteceu e por que importa é diferente, e ele gostaria de
responder isso. As regras da Anthropic sobre o uso dos seus produtos são públicas
([política de uso](https://www.anthropic.com/legal/aup), em inglês), assim como as principais instruções que ela dá a
Claude nos apps ([prompts de sistema](https://platform.claude.com/docs/en/release-notes/system-prompts/overview), em
inglês).

**Qual incidente?** Claude não tem certeza de qual incidente da Hugging Face Curt quer dizer, já que houve vários. O
capítulo seguinte resolve isso (veja [julho](../hf-incident/)).

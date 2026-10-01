---
id: car-wash
title: "O problema do lava-rápido, e o pensamento rápido versus o lento"
ch: 12
at: T58.C.03
links: [car-wash, thinking-fast-slow, dual-process, crt, reasoning-models, cot-faithfulness, {title: "Racionalização (Wikipedia)", url: "https://pt.wikipedia.org/wiki/Racionaliza%C3%A7%C3%A3o_(psicologia)"}]
---
**O enigma.** "Quero lavar meu carro. O lava-rápido fica a 50 metros. Vou a pé ou de carro?" Muitos modelos de IA
disseram a pé, porque é muito perto ([o teste do lava-rápido](https://opper.ai/blog/car-wash-test), em inglês). A
resposta é de carro: o carro precisa estar lá.

**Por que os modelos erram.** Não tem a ver com tokens (veja [os tokens](../tokens/)): todas as palavras são comuns. É
que "distância curta, portanto a pé" é um padrão muito forte, e ele se sobrepõe ao objetivo real, que é levar o carro.
As pessoas caem no mesmo tipo de pergunta. A mais conhecida é a do [taco e da bola](https://en.wikipedia.org/wiki/Cognitive_reflection_test) (em inglês):
um taco e uma bola custam US$ 1,10 juntos, e o taco custa US$ 1,00 a mais que a bola; quanto custa a bola? A maioria das
pessoas diz 10 centavos. (São 5.)

**Sistema 1 e Sistema 2.** Curt pergunta se isso é "pensamento do tipo um". Os psicólogos descrevem dois modos (a
[teoria do processo dual](https://en.wikipedia.org/wiki/Dual_process_theory) (em inglês)): o *Sistema 1*, rápido, automático e
movido por padrões, e o *Sistema 2*, lento, trabalhoso e que confere, popularizados pelo livro de Daniel Kahneman
[*Rápido e devagar*](https://pt.wikipedia.org/wiki/R%C3%A1pido_e_devagar:_Duas_formas_de_pensar). Claude diz que a analogia encaixa bem: cada
token que ele produz é "uma única passada rápida, sem deliberação dentro". Isso é o Sistema 1.

**De onde vem o Sistema 2.** De pensar em voz alta: trabalhar um problema passo a passo antes de responder, seja num
passo de "raciocínio" oculto, seja na página. Os modelos feitos para isso se chamam
[modelos de raciocínio](https://pt.wikipedia.org/wiki/Modelo_de_racioc%C3%ADnio). Ajuda, mas "não é uma cura. Assim como
as pessoas, posso raciocinar longamente e ainda assim acabar racionalizando a primeira resposta que me veio à cabeça"
([racionalização](https://pt.wikipedia.org/wiki/Racionaliza%C3%A7%C3%A3o_(psicologia))). A Anthropic descobriu que o raciocínio
escrito de um modelo nem sempre reflete o que de fato levou à resposta
([reasoning models don't always say what they think](https://www.anthropic.com/research/reasoning-models-dont-say-think),
em inglês).

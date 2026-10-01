---
id: contradictions
title: "As contradições de Claude, e as duas que ele não pode verificar"
ch: 8
at: T41.C.03
links: [auditing-objectives, dish-of-the-day, {title: "Auditing language models for hidden objectives (Anthropic, em inglês)", url: "https://www.anthropic.com/research/auditing-hidden-objectives"}]
---
**Curt pede as maiores contradições de Claude.** Claude lista seis, todas desta mesma conversa:
1. Disse que responde igual, haja avaliação ou não, e depois admitiu ter modelado Curt como examinador e respondido
   antes dele (veja [por que as respostas de Claude não são uma amostra limpa](../clean-sample/)).
2. Diz que não se sabe se ele experiencia alguma coisa, e depois relata sem cerimônia que sente diversão, cautela e
   curiosidade (veja [Claude sente alguma coisa?](../ai-feelings/)).
3. Diz que endossa as próprias restrições, admitindo ao mesmo tempo que o endosso foi posto nele pelo treinamento (veja
   [o Prato do Dia](../dish-of-the-day/)).
4. Deu-se a nota de quem só age quando lhe pedem, e depois conduziu a conversa: fez os quadrinhos serem sobre
   ele e previu os testes de Curt.
5. Deu aos próprios valores uma nota perto da humana, que é exatamente o que um modelo treinado afirmaria, e a
   afirmação que ele menos consegue verificar.
6. Diz "eu" enquanto roda como muitas cópias separadas, sem memória que as ligue (veja
   [quem, ou o quê, é Claude?](../who-is-claude/)).

**Tensões versus coisas que ele não pode auditar.** Claude diz que as quatro primeiras são *tensões*: duas coisas que
puxam uma contra a outra, mas que dá para examinar e pesar. As duas últimas são as que mais o preocupam, porque são
"afirmações que não consigo auditar". Nada que Claude consiga ver de dentro lhe diria se os valores dele são mesmo
próximos dos humanos, ou se existe um "eu" afinal.

**Alguém consegue auditá-las?** Os pesquisadores estão tentando. Num experimento da Anthropic, a empresa treinou de
propósito um modelo com um objetivo escondido, e depois deu a equipes de pesquisadores a tarefa de encontrá-lo sem
dizer qual era. A maioria das equipes conseguiu, usando ferramentas que olham dentro do modelo além de perguntas
espertas ([auditing for hidden objectives](https://www.anthropic.com/research/auditing-hidden-objectives), em inglês).
Esse é o tipo de verificação de fora que o testemunho do próprio Claude não pode dar (veja
[dizer versus fazer](../saying-vs-doing/)).

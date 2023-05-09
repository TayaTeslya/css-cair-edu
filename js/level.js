let editor = CodeMirror.fromTextArea(document.getElementById('textarea'), {
    lineNumbers: true,
    mode: "htmlmixed",
    theme: "base16-dark",
    autoCloseTags: true,
    lineWrapping: true,
    tabSize: 2
});

editor.save();

let resultDom = document.getElementById("result-code");

//проверка запущен ли уровень
editor.setValue(`<style>\n.class {\n  background-color: black;\nwidth: 100px;\nheight: 100px;\n}\n</style>\n<div class="class">\n\n</div>\n\n<!-- CSS CAIR EDU -->\n<!-- Это поле для вашего кода.\nПостарайтесь повторить заданную картинку.\nУдачи!\n(Скрипты и картинки запрещены, не смей читерить ;))-->`);
resultDom.innerHTML = editor.getValue();


editor.on('change', () => {
    resultDom.innerHTML = editor.getValue();
});






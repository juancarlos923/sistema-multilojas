function mask(o, f) {
    setTimeout(function() {
        var v = mphone(o.value);
        if (v != o.value) {
        o.value = v;
        }
    }, 1);
}

function mphone(v) {
    var r = v.replace(/\D/g, "");
    r = r.replace(/^0/, "");
    if (r.length > 10) {
        r = r.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else if (r.length > 5) {
        r = r.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    } else if (r.length > 2) {
        r = r.replace(/^(\d\d)(\d{0,5})/, "($1) $2");
    } else {
        r = r.replace(/^(\d*)/, "($1");
    }
    return r;
}

function maskc(o, f) {
    setTimeout(function() {
        var v = cpf(o.value);
        if (v != o.value) {
        o.value = v;
        }
    }, 1);
}

function cpf(v){
    var c = v.replace(/\D/g, "");
    if (c.length > 8) {
        c = c.replace(/^(\d{3})(\d{3})(\d{0,3})(\d{0,2}).*/, "$1.$2.$3-$4");
    } else if (c.length > 6) {
        c = c.replace(/^(\d{3})(\d{3})(\d{0,3}).*/, "$1.$2.$3");
    } else {
        c = c.replace(/^(\d{3})(\d)/, "$1.$2");
    }
    return c;
}
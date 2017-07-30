/**
 * Created by Alexey on 30.07.2017.
 */
window.MyForm = {
    validate: function () {
        console.log('validate')
        var emailPattern = /\S+@(ya.ru|yandex.ru|yandex.ua|yandex.by|yandex.kz|yandex.com)$/;
        var phonePattern = /^\+[7]\([\d]{3}\)([\d]{3})-([\d]{2})-([\d]{2})$/;
        var result = {
            isValid: true,
            errorFields: []
        };
        /*Валидация фио*/
        var fio = $("input[name=fio]").val();
        if (fio.split(" ").length != 3) {
            result.isValid = false;
            result.errorFields.push("fio");
        }
        /*Валидация email*/
        if (!emailPattern.test($("input[name='email']").val())) {
            result.isValid = false;
            result.errorFields.push("email");
        }
        /*Валидация телефона*/
        var isPhoneValid = true;
        var phoneVal = $("input[name='phone']").val();
        if (phonePattern.test(phoneVal)) {
            var phoneSum = 0;
            phoneVal = phoneVal.replace(/[+()-]/g, '');
            for (var x = 0; x < phoneVal.length; x++)
                phoneSum += parseInt(phoneVal.charAt(x));
            if (phoneSum > 30)
                isPhoneValid = false;
        }
        else
            isPhoneValid = false;
        if (!isPhoneValid) {
            result.isValid = false;
            result.errorFields.push("phone");
        }
        return result;
    },
    getData: function () {
        var result = {};
        $.each($("form#myForm").find("input"), function (i, item) {
            item = $(item);
            result[item.attr('name')] = item.val();
        });
        return result;

    },
    setData: function (object) {
        $.each(object, function (item) {
            $("input[name='" + item + "']").val(object[item]);
        });
    },
    timer: undefined,
    submit: function () {
        clearTimeout(window.MyForm.timer);
        var validResult = window.MyForm.validate();
        if (validResult.isValid) {

            $('#resultContainer').removeClass();
            $('#submitButton').attr('disabled', true);
            var sendTo = $("#myForm").attr('send-to');
            $.ajax({
                url: "app/json/" + sendTo,
                type: 'get',
                success: function (data) {
                    $('#resultContainer').addClass(data.status);
                    switch (data.status) {
                        case "success":
                            $('#resultContainer').text("Success");
                            break;
                        case "error":
                            $('#resultContainer').text(data.reason);
                            break;
                        case "progress":
                            console.log('progress, submit again', data.timeout);
                            window.MyForm.timer = setTimeout(function () {
                                window.MyForm.submit()
                            }, data.timeout);
                            break;
                    }
                },
                error: function () {
                    alert("ajax error")
                }
            });
        }
        else {
            $.each(validResult.errorFields, function (i, field) {
                $("input[name='" + field + "']").addClass('error');
            });
        }
    }
};
$(document).ready(function () {

    $("#submitButton").click(function (e) {
        e.preventDefault();
        $("#myForm").find('input').removeClass('error');
        window.MyForm.submit();
    });

});
 function toggleInput() {
      let input4 = document.getElementById("input4");
      input4.disabled = !input4.disabled; 
      if (input4.disabled) input4.value = ""; // إذا أوقفناها نمسح القيمة
    }

    function getValue(inputId) {
      let input = document.getElementById(inputId);
      let value = parseFloat(input.value);

      if (isNaN(value)) return 0; // إذا فاضي

      let min = parseFloat(input.min);
      let max = parseFloat(input.max);

      if (value < min || value > max) {
        throw `خطأ في ${inputId}: القيمة يجب أن تكون بين ${min} و ${max}`;
      }
      return value;
    }

    function calculate() {
      let resultDiv = document.getElementById("result");
      resultDiv.innerHTML = ""; // مسح القديم

      try {
        let sum = 0;
        let totalMax = 0;
        let isFail = false;

        // الإدخالات الثابتة
        let v1 = getValue("input1");
        sum += v1;
        totalMax += 100;
        if (v1 < 100 / 2) isFail = true;

        let v2 = getValue("input2");
        sum += v2;
        totalMax += 100;
        if (v2 < 100 / 2) isFail = true;

        let v3 = getValue("input3");
        sum += v3;
        totalMax += 40;
        if (v3 < 40 / 2) isFail = true;

        // الإدخال الاختياري
        let input4 = document.getElementById("input4");
        if (!input4.disabled) {
          let v4 = getValue("input4");
          sum += v4;
          totalMax += 60;
          if (v4 < 60 / 2) isFail = true;
        }

        let percentage = (sum / totalMax) * 30;

        resultDiv.innerHTML = 
          `<div class="result">
             المجموع: ${sum} / ${totalMax}<br>
             ٪النسبة: ${percentage.toFixed(2)}<br>
             ${isFail ? '<span class="fail">راسب</span>' : '<span class="success">ناجح</span>'}
           </div>`;
      } catch (err) {
        resultDiv.innerHTML = `<div class="error">${err}</div>`;
      }
    }
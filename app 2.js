// سلوك تفاعلي بسيط للواجهة - محلي (بدون باك-إند حقيقي)
document.addEventListener('DOMContentLoaded', ()=> {
  const pages = {
    home: document.getElementById('home'),
    register: document.getElementById('register'),
    categories: document.getElementById('categories'),
    game: document.getElementById('game'),
    payment: document.getElementById('payment')
  };

  const show = (pageId) => {
    Object.values(pages).forEach(p=>p.classList.remove('active'));
    pages[pageId].classList.add('active');
    window.scrollTo({top:0,behavior:'smooth'});
  };

  // عناصر الهامبرغر والأزرار
  document.getElementById('startFreeBtn').addEventListener('click', ()=> {
    show('register');
  });
  document.getElementById('loginBtn').addEventListener('click', ()=> {
    // مؤقتًا نستخدم صفحة التسجيل كصفحة دخول
    show('register');
  });
  document.getElementById('backToHome').addEventListener('click', ()=> show('home'));

  // تسجيل بيانات المستخدم (محاكاة)
  const regForm = document.getElementById('registerForm');
  regForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const fd = new FormData(regForm);
    const user = {
      name: fd.get('name').trim(),
      phone: fd.get('phone').trim(),
      email: fd.get('email').trim()
    };
    if(!user.name || !user.phone || !user.email){
      alert('الرجاء ملء جميع الحقول');
      return;
    }
    localStorage.setItem('santos_user', JSON.stringify(user));
    show('categories');
  });

  // اختيار الفرق والفئات
  document.getElementById('startGameBtn').addEventListener('click', ()=>{
    const team1 = document.getElementById('team1').value.trim() || 'فريق 1';
    const team2 = document.getElementById('team2').value.trim() || 'فريق 2';
    const checkedCats = [...document.querySelectorAll('.cat:checked')].map(i=>i.value);
    if(checkedCats.length === 0){
      alert('اختر فئة واحدة على الأقل');
      return;
    }
    const session = {team1, team2, categories: checkedCats};
    localStorage.setItem('santos_session', JSON.stringify(session));
    document.getElementById('displayTeam1').textContent = team1;
    document.getElementById('displayTeam2').textContent = team2;
    show('game');
    startTimer(15);
    // تحميل أول سؤال تجريبي
    loadQuestion();
  });

  document.getElementById('catBack').addEventListener('click', ()=> show('register'));

  // لعبة تجريبية بسيطة - أسئلة وهمية للتجربة
  let timerInterval = null;
  let currentTurn = 1; // 1 or 2
  function startTimer(sec){
    clearInterval(timerInterval);
    let t = sec;
    document.getElementById('timer').textContent = t;
    timerInterval = setInterval(()=> {
      t--; document.getElementById('timer').textContent = t;
      if(t<=0){
        clearInterval(timerInterval);
        alert('انتهى الوقت! انتقل لصفحة الدفع (محاكاة)');
        show('payment');
      }
    }, 1000);
  }

  function loadQuestion(){
    const q = {
      text: 'سؤال تجريبي: ما عاصمة السعودية؟',
      answers: ['الرياض','جدة','مكة','الدمام'],
      correct: 0
    };
    document.getElementById('questionText').textContent = q.text;
    const ansBtns = document.querySelectorAll('.answers .ans');
    ansBtns.forEach((b,i)=> {
      b.textContent = q.answers[i];
      b.onclick = ()=> {
        if(i === q.correct){
          alert('إجابة صحيحة! النقاط تُسجّل (محاكاة).');
        } else {
          alert('خطأ! تنتقل الفرصة للفريق الآخر.');
        }
        // تبديل الدور
        toggleActiveTeam();
        startTimer(15);
      };
    });
  }

  function toggleActiveTeam(){
    const t1 = document.getElementById('displayTeam1');
    const t2 = document.getElementById('displayTeam2');
    if(t1.classList.contains('active-team')){
      t1.classList.remove('active-team');
      t2.classList.add('active-team');
    } else {
      t2.classList.remove('active-team');
      t1.classList.add('active-team');
    }
  }

  document.getElementById('finishGame').addEventListener('click', ()=> {
    if(confirm('انتهى اللعب؟ سيتم الانتقال لصفحة الدفع (محاكاة).')){
      show('payment');
    }
  });

  document.getElementById('gameBack').addEventListener('click', ()=> {
    if(confirm('تأكيد الخروج؟')) {
      show('home');
    }
  });

  // الدفع (محاكاة)
  document.getElementById('payNow').addEventListener('click', ()=> {
    const pack = document.querySelector('input[name="pack"]:checked').value;
    alert(`محاكاة: تم اختيار باقة بقيمة ${pack} ريال. شكراً لشرائك!`);
    // بعد الدفع نعيد للصفحة الرئيسية
    show('home');
  });
  document.getElementById('payBack').addEventListener('click', ()=> show('game'));

  // إعداد السنة في الفوتر
  document.getElementById('year').textContent = new Date().getFullYear();

  // قائمة همبرغر (مكان لوضع روابط حقيقية لاحقًا)
  document.getElementById('menuBtn').addEventListener('click', ()=> {
    alert('القائمة: (مثال) — الصفحة الرئيسية، الأسئلة، تواصل معنا.');
  });

});

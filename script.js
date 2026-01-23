document.addEventListener('DOMContentLoaded', () => {
    // === 获取 DOM 元素 ===
    const els = {
        input: document.getElementById('inputId'),
        parseBtn: document.getElementById('parseBtn'),
        resultBox: document.getElementById('resultBox'),
        notice: document.getElementById('notice'),
        audio: document.getElementById('audioPlayer'),
        songTitle: document.getElementById('songTitle'),
        songMeta: document.getElementById('songMeta'),
        playBtn: document.getElementById('playBtn'),
        downloadBtn: document.getElementById('downloadBtn'),
        openBtn: document.getElementById('openBtn'),
        copyBtn: document.getElementById('copyBtn'),
        // 弹窗相关
        aboutModal: document.getElementById('aboutModal'),
        openAbout: document.getElementById('openAbout'),
        closeAbout: document.getElementById('closeAbout')
    };

    // === 弹窗逻辑 (切换 active 类名触发 CSS 动画) ===
    els.openAbout.onclick = () => {
        els.aboutModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // 防止滚动
    };
    
    const closeModal = () => {
        els.aboutModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    els.closeAbout.onclick = closeModal;
    els.aboutModal.onclick = (e) => {
        if (e.target === els.aboutModal) closeModal();
    };

    // === 工具函数：显示提示 ===
    function showNotice(msg, type = 'normal') {
        els.notice.textContent = msg;
        els.notice.className = 'notice ' + type;
    }

    // === 工具函数：提取 ID ===
    function extractId(val) {
        if (!val) return null;
        let m = val.match(/[?&]id=(\d{5,})/) || val.match(/^(\d{5,})$/) || val.match(/(\d{5,})/);
        return m ? m[1] : null;
    }

    // === 解析主逻辑 ===
    els.parseBtn.onclick = () => {
        const inputVal = els.input.value.trim();
        const id = extractId(inputVal);

        if (!id) {
            showNotice('❌ 无法识别的歌曲 ID 或链接', 'error');
            return;
        }

        const mp3Url = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;

        // 更新 UI
        els.resultBox.style.display = 'block';
        showNotice('✅ 解析成功，资源已就绪', 'success');

        els.songTitle.textContent = `当前解析 ID: ${id}`;
        els.songMeta.textContent = 'MP3 音频源 | Ready to play';
        
        els.audio.pause();
        els.audio.src = mp3Url;
        els.audio.load();

        els.downloadBtn.href = mp3Url;
        els.openBtn.href = mp3Url;

        // 复制逻辑
        els.copyBtn.onclick = () => {
            navigator.clipboard.writeText(mp3Url).then(() => {
                const originalText = els.copyBtn.innerHTML;
                els.copyBtn.innerHTML = '<span>已复制</span>';
                setTimeout(() => {
                    els.copyBtn.innerHTML = originalText;
                }, 2000);
            });
        };
    };

    // 播放逻辑
    els.playBtn.onclick = () => {
        if (!els.audio.src) return showNotice('请先解析歌曲', 'error');
        els.audio.play();
    };

    // 监听回车键
    els.input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') els.parseBtn.click();
    });
});

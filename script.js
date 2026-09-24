// ==============================
// Supabase接続
// ==============================

const SUPABASE_URL =
    'https://lcavxggiibcbnwcdqggu.supabase.co';

const SUPABASE_PUBLISHABLE_KEY =
    'sb_publishable_ow6k0uUYd6ZIj2uN3jiGg_-EqTFD-h';

let supabaseClient = null;


function initSupabase() {

    // Supabaseライブラリ確認
    if (!window.supabase) {

        console.error(
            'Supabaseライブラリが読み込まれていません。'
        );

        alert(
            'Supabaseのライブラリが読み込まれていません。'
        );

        return false;
    }


    // クライアント作成
    if (!supabaseClient) {

        supabaseClient =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_PUBLISHABLE_KEY
            );

        console.log(
            'Supabase接続を初期化しました。'
        );
    }


    return true;
}



// ==============================
// Supabaseへ保存
// ==============================

document
    .getElementById('btnSaveToSupabase')
    .addEventListener('click', async () => {

        console.log(
            'Supabase保存ボタンが押されました。'
        );


        // Supabase初期化
        if (!initSupabase()) {
            return;
        }


        // 暗号化データ取得
        const resultElement =
            document.getElementById(
                'encryptResult'
            );


        if (!resultElement) {

            alert(
                'encryptResultが見つかりません。'
            );

            return;
        }


        const hex =
            resultElement.getAttribute(
                'data-hex'
            );


        console.log(
            '保存するデータ:',
            hex
        );


        // 暗号化されていない場合
        if (!hex) {

            alert(
                '先に暗号化してください。'
            );

            return;
        }


        // ==============================
        // INSERT
        // ==============================

        const result =
            await supabaseClient
                .from('encrypted_data')
                .insert({
                    encrypted_payload: hex
                })
                .select();


        console.log(
            'Supabase INSERT結果:',
            result
        );


        // エラー
        if (result.error) {

            console.error(
                'Supabase INSERT ERROR:',
                result.error
            );

            alert(
                'Supabaseへの保存に失敗しました。\n\n' +
                result.error.message
            );

            return;
        }


        // 成功
        console.log(
            'Supabaseへの保存成功:',
            result.data
        );


        alert(
            '🎉 暗号化データをSupabaseに保存しました！'
        );

});



// ==============================
// Supabaseから取得
// ==============================

document
    .getElementById('btnFetchSupabase')
    .addEventListener('click', async () => {

        console.log(
            'Supabase取得ボタンが押されました。'
        );


        if (!initSupabase()) {
            return;
        }


        const result =
            await supabaseClient
                .from('encrypted_data')
                .select('*')
                .order(
                    'created_at',
                    {
                        ascending: false
                    }
                );


        console.log(
            'Supabase SELECT結果:',
            result
        );


        if (result.error) {

            console.error(
                'Supabase SELECT ERROR:',
                result.error
            );

            alert(
                'データの取得に失敗しました。\n\n' +
                result.error.message
            );

            return;
        }


        const listContainer =
            document.getElementById(
                'supabaseList'
            );


        listContainer.innerHTML = '';


        if (!result.data ||
            result.data.length === 0) {

            listContainer.innerText =
                'データが空っぽです';

            return;
        }


        result.data.forEach(item => {

            const div =
                document.createElement(
                    'div'
                );


            div.className =
                'supabase-item';


            div.innerText =
                `[${new Date(
                    item.created_at
                ).toLocaleString()}] ${item.encrypted_payload}`;


            div.addEventListener(
                'click',
                () => {

                    document.getElementById(
                        'cipherText'
                    ).value =
                        item.encrypted_payload;

                    alert(
                        '暗号文を解除欄にセットしました！'
                    );

                }
            );


            listContainer.appendChild(
                div
            );

        });

});

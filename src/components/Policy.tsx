import * as React from 'react';
import { StyleRules, WithStyles, withStyles } from '@material-ui/core/styles';
import { Typography, Paper } from '@material-ui/core';

const styles: StyleRules<'root'|'paper'> = {
    root: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        marginTop: 20
    },
    paper: {
        width: '90%',
        height: '60vh',
        overflow: 'scroll',
        maxWidth: 700
    }
};

type ClassNames = keyof typeof styles;


class Policy extends React.Component<
                                            WithStyles<ClassNames>, 
                                            {}> {

   public render(): JSX.Element {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <Paper className={classes.paper}>
                    <Typography variant="headline" component="h3">
                    プライバシーポリシー
                    </Typography>
<br />
<Typography component="p">
aKnow2（以下、「乙」といいます。）は、乙が提供する全てのスマートフォン用アプリケーション、およびWebサービスに関するサービス（以下、「サービス」といいます。）を通じて、
お客様の利用者情報をご提供いただき、本サービスの円滑な提供を実施させていただくために、アプリケーション・プライバシーポリシーを定め、利用者情報の保護に努めます。
</Typography>
<br />
<Typography component="p">
また、お客様が本アプリケーションによる利用者情報の提供をご希望されない場合は、お客様ご自身のご判断により、利用者情報の提供を拒否することができます。
この場合、本アプリケーションおよび本サービスをご利用になれない場合がありますので、予めご了承ください。
</Typography>
<br />
<Typography component="p">
1. 法令等の順守について<br />
乙は、個人情報保護の実現のため、個人情報保護法、各省庁ガイドラインその他関連する法令等を順守いたします。
</Typography>
<br />
<Typography component="p">
2. 目的<br />
乙は、乙のサービスとアプリケーションの運営に必要な範囲で個人情報を保有します。乙における具体的な個人情報の利用目的は次のとおりです。これら以外の目的に利用することはありません。
<br />
<br />
・サービスの運営およびこれらに付帯・関連するサービスの提供
</Typography>
<br />
<Typography component="p">
3. 個人情報の第三者への提供<br />
当社は、次の場合を除いて、ご本人の同意なく個人情報を第三者へ提供することはありません。<br />
<br />
・裁判所・警察等の公的機関から、法令に基づく正式な照会要請を受けた場合。<br />
・人の生命、身体および財産等に対し差し迫った危険があり、緊急の必要性があると認められる場合。 <br />
・利用者が希望するサービスの提供のため、情報の開示や共有が必要と認められる場合。<br />
・利用者にサービスを提供する目的で乙から委託を受けて業務を行う会社が情報を必要とする場合。(こうした会社は乙が提供した個人情報を上記目的の必要限度を超えて利用することはできません。)<br />
・利用者の行為が、利用規約に反し、当社および第三者の権利・財産やサービス等を保護するため必要と認められる場合。<br />
・利用者がご本人の個人情報を第三者へ提供することにつき同意をされた場合。<br />
・乙のサービスでは、サイトの分析と改善のためにGoogleアナリティクスを使用しています。<br />
  Googleアナリティクスの作成会社であるGoogle Inc.に特定の情報（たとえば、アクセスしたページのウェブ アドレスや IP アドレスなど）を自動的に送信します。<br />
  また、データ収集のためにGoogle Inc. がお使いのブラウザに cookie を設定したり、既存のcookieを読み取ったりする場合があります
</Typography>
<br />
<Typography component="p">
4.利用者情報の取り扱いに関する問い合わせ窓口<br />
本アプリケーションおよび本サービスにおける利用者情報の取扱いに関して、ご意見・ご要望がございましたら、下記窓口までご連絡くださいますようお願いします。<br />
<br />
■お問い合わせ方法：anou.games.jp@gmail.com<br />
</Typography>
<br />
<Typography component="p">
5.本アプリケーション・プライバシーポリシーの変更<br />
当社は、法令の変更等に伴い、本アプリケーション・プライバシーポリシーを変更することがあります。
当社は、本アプリケーションのバージョンアップに伴って、利用者情報の取得項目の変更や追加、利用目的の変更、第三者提供等について変更がある場合には、本アプリケーション・プライバシーポリシーにて通知いたします。
</Typography>
<br />
<Typography component="p">
6. 個人データの安全管理措置<br />
乙は、ご本人の個人情報を正確、最新なものにするよう常に適切な処置を講じています。
また、ご本人の個人情報への不当なアクセス、個人情報の紛失・破壊・改ざん・漏えいなどを防止するため、万全を尽くしています。
なお、当社の委託を受けて個人情報を取り扱う会社にも、同様に厳重な管理を行わせています。万一、個人情報に関する事故が発生した場合には、迅速かつ適切に対応いたします。
<br />
<br />
以上 2018年10月 制定
</Typography>

                </Paper>
            </div>
        );
    }

}

const StyledContainer = withStyles<{} & ClassNames>(styles)(Policy);

export default StyledContainer;
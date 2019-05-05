<template>
	<div id="imprint">		
		<page-wrapper>
			<header>
				<h1>Impressum</h1>
				<span class="version-warning"><md-icon>info</md-icon> Only german version available for now, english version will follow soon.</span>
			</header>	
			<main>
				<section>
					<h3>Angaben gemäß § 5 TMG</h3>
					<p>
						<span>Simon Hereth</span> 
						<span>AWAY FROM LIFE (Einzelunternehmer)</span>
						<span>Flachsacker 2</span>
						<span>97762 Hammelburg</span>
					</p>
				</section>

				<section>
					<h3>Kontakt</h3>
					<p>Telefon: +49 (0) 174 676 13 84</p>
					<p>E-Mail: info@awayfromlife.com</p>
				</section>

				<section>
					<h3>Umsatzsteuer-ID</h3>
					<p>Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:</p>
					<p>DE 321 758 139</p>
				</section>

				<section>
					<h3>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h3>
					<p>
						<span>Simon Hereth</span> 
						<span>Flachsacker 2</span>
						<span>97762 Hammelburg</span>
					</p>
					
					<p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>

					<h5>Haftung für Inhalte</h5>
					<p>Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.</p>
					<p>Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.</p>

					<h5>Haftung für Links</h5>
					<p>Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.</p>
					<p>Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.</p>

					<h5>Urheberrecht</h5>
					<p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.</p>
					<p>Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.</p>
					<p>Quelle: <a href="https://www.e-recht24.de">https://www.e-recht24.de</a></p>
				</section>
			</main>
		</page-wrapper>
	</div>
</template>

<script>
import PageWrapper from '@/components/InfoPages/PageWrapper';

export default {
	name: "imprint",
	components: {
		PageWrapper
	}
}
</script>

<style lang="scss">
	@import "src/scss/InfoPages/_infoPage.scss";
</style>
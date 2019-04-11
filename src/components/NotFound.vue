<template>
    <div id="not_found">
        <div class="content">
            <div class="giphy">
				<img src="https://media.giphy.com/media/xT1R9VOt8kNtU15rwI/giphy.gif" alt="Whoopsie, Page not found!">
				<p style="margin-top: 0px;"><a href="https://giphy.com/gifs/zditalents-sorry-oops-xT1R9VOt8kNtU15rwI" target="_blank">via GIPHY</a></p>
				<!-- <div style="width:100%;height:0;padding-bottom:150px;position:relative;"><iframe src="https://giphy.com/embed/xT1R9VOt8kNtU15rwI" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p style="margin-top: 0px; text-align:center;"><a href="https://giphy.com/gifs/zditalents-sorry-oops-xT1R9VOt8kNtU15rwI" target="_blank">via GIPHY</a></p> -->
			</div>
            <h1>WHOOOPSIE, LOOKS LIKE THE PAGE YOU'RE LOOKING FOR DOESN'T EXIST...</h1>
			<div class="alternative-suggestions">
				<h2 class="alt-header">But now that you are already here, you could:</h2>
				<ul>
					<li><router-link to="/"><h3>search for some events in your area</h3></router-link></li>
					<li><router-link to="/bands"><h3>discover some new bands</h3></router-link></li>
				</ul>
			</div>
        </div>
        <div class="color-block"></div>
    </div>
</template>

<script>
export default {
    name: 'not-found',
    mounted() {
        document.getElementById('topbar').classList.add('single-page');
    }
}
</script>

<style lang="scss">
    @import "src/scss/SingleContentPages/_notFound.scss";
    #not_found {
        h1 {
            line-height: 1.05em;
        }
    }
</style>

<template>
    <div id="not_found">
        <div class="content">
            <div style="width:100%;height:0;padding-bottom:150px;position:relative;"><iframe src="https://giphy.com/embed/xT1R9VOt8kNtU15rwI" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p style="margin-top: 0px; text-align:center;"><a href="https://giphy.com/gifs/zditalents-sorry-oops-xT1R9VOt8kNtU15rwI">via GIPHY</a></p>
            <h1>WHOOOPSIE, LOOKS LIKE THE PAGE YOU'RE LOOKING FOR DOESN'T EXIST...</h1>
        </div>
        <div class="color-block"></div>
    </div>
</template>

<script>
export default {
    name: 'not-found'
}
</script>

<style lang="scss">
    @import "src/scss/SingleContentPages/_generalPage.scss";
    #not_found {
        h1 {
            line-height: 1.05em;
        }
    }
</style>

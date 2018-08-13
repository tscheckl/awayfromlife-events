<template>
    <div id="report_dialog">
        <h2>Give us a short reason for your report: </h2>
        <md-input-container>
            <label>Reason for your report</label>
            <md-textarea required class="report-ta" v-model="reportDescription"></md-textarea>
        </md-input-container>
        <md-button class="md-raised md-accent" v-on:click="sendReport">Send report</md-button>
    </div>
</template>

<script>
import {frontEndSecret, backendUrl } from '@/secrets.js';

export default {
    name: 'report-dialog',
    props: {
        contentType: String
    },
    data() {
        return {
            reportDescription: ''
        }
    },
    methods: {
        sendReport() {            
            let report = {
                description: this.reportDescription,
                category: this.contentType,
                item: this.$route.params.id
            }
            
            if(this.reportDescription.length > 0) {
                this.$http.post(backendUrl + '/api/reports',  report)
                    .then(response => {
                        this.reportDescription = '';
                        this.$emit('close', 'Thanks for your report, we will have a look at it!');
                    })
                    .catch(err => {this.$emit('close', 'Something went wrong while sending your report. Please try again!');})
            }
        }
    }
}
</script>

<style lang="scss">
    @import "src/scss/SingleContentPages/_reportDialog.scss";
</style>

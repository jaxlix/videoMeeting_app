<template>
    <div>
        <mt-header fixed title="我的">
            <mt-button icon="back" slot="left" @click="$router.history.go(-1)">返回</mt-button>
            <mt-button icon="more" slot="right"></mt-button>
        </mt-header>
    </div>
</template>

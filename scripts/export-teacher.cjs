const fs=require('fs');
const path=require('path');
const vm=require('vm');

const out='dist/teacher';
fs.rmSync(out,{recursive:true,force:true});
fs.mkdirSync(out,{recursive:true});

const files=[
  'index.html',
  ...Array.from({length:8},(_,i)=>`lesson-data-${i+1}.js`),
  'lesson10-phrase-reading-v1.js',
  'lesson10-phrase-reading-refined.js',
  'lesson-data-v1.js',
  'lesson-references-v1.js',
  'lesson10-learning-v1.js',
  'lesson10-map-v1.js',
  'lesson10-enhance-v1.js',
  'lesson10-teacher-tools.js',
  'lesson10-v1.css'
];
for(const f of files) fs.copyFileSync(f,path.join(out,f));

// The runtime uses lesson-data.js only to initialize the Clover source container.
// Keep that behavior under an explicit runtime-only filename in the integrated build.
fs.copyFileSync('lesson-data.js',path.join(out,'lesson-source-init.js'));
const exportedIndex=fs.readFileSync(path.join(out,'index.html'),'utf8')
  .replace('<script src="lesson-data.js"></script>','<script src="lesson-source-init.js"></script>');
fs.writeFileSync(path.join(out,'index.html'),exportedIndex);

// Build a static canonical LESSON_DATA snapshot for English Classroom validation.
// This file is not loaded by the exported runtime page.
global.window={};
for(const f of [
  'lesson-data.js',
  ...Array.from({length:8},(_,i)=>`lesson-data-${i+1}.js`),
  'lesson10-phrase-reading-v1.js',
  'lesson10-phrase-reading-refined.js',
  'lesson-data-v1.js'
]){
  vm.runInThisContext(fs.readFileSync(f,'utf8'),{filename:f});
}
if(!Array.isArray(global.window.LESSON_DATA)||global.window.LESSON_DATA.length!==40){
  throw new Error(`Expected 40 LESSON_DATA items, got ${global.window.LESSON_DATA?.length}`);
}
fs.writeFileSync(
  path.join(out,'lesson-data.js'),
  `window.LESSON_DATA=${JSON.stringify(global.window.LESSON_DATA)};\n`
);

fs.writeFileSync(
  path.join(out,'lesson-meta.json'),
  JSON.stringify({
    schemaVersion:1,
    id:'clover.lesson10',
    title:'Clover Lesson 10',
    series:'Clover',
    lesson:'10',
    grade:3,
    subject:'English',
    engine:'v1',
    status:'ready',
    questionCount:40,
    formats:['blank','choice','order'],
    teacherMode:true,
    studentExport:true
  },null,2)+'\n'
);

console.log('Teacher export created with validation snapshot');

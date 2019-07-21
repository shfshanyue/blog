const { exec } = require('child_process')

const p = exec('strace -o oo node', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
})

console.log(p.pid)

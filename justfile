anchor *args:
    anchor {{args}}

build program:
    anchor build -p {{program}}
    just copy-idl

build-all:
    anchor build
    just copy-idl

deploy program:
    just build {{program}}
    anchor deploy -p {{program}}
    just copy-idl

deploy-all:
    anchor build
    anchor deploy
    just copy-idl

test program:
    anchor run {{program}}

test-all:
    anchor test --skip-build --skip-deploy --skip-local-validator

recover program:
    solana-keygen recover -o ./target/deploy/intermediate-deploy-{{program}}.json -f

redeploy program:
    solana program deploy --buffer ./target/deploy/intermediate-deploy-{{program}}.json --program-id ./target/deploy/{{program}}-keypair.json  ./target/deploy/{{program}}.so -v

extend program amount:
    solana program extend ./target/deploy/{{program}}-keypair.json {{amount}}

close program:
    solana program close -k ~/.config/solana/deployer.json ./target/deploy/intermediate-deploy-{{program}}.json
	
copy-idl:
    cp -v ./target/idl/* ./protocol/ts/src/idl
    cp -v ./target/types/* ./protocol/ts/src/idl
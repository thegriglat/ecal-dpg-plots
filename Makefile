all: build

NG := node_modules/.bin/ng
NGOPTS := --prod --base-href https://ecaldpgplots.web.cern.ch/ --deploy-url https://ecaldpgplots.web.cern.ch/
REPOS := $(shell python3 -c "import json;print('\n'.join([x['git'] for x in json.load(open('site/settings.json'))['sections']]))" | sed 's,https://,,g')

build: generate
	cd site && $(NG) build $(NGOPTS)

generate: $(REPOS)
	echo $(REPOS) generated

content_dir:
	mkdir -p content

$(REPOS): content_dir
	cd content ;\
	reponame="$$(basename '$@' | cut -d'.' -f 1)" ;\
	repodir="$${reponame}_tmp";\
	git clone https://$@ $$repodir ;\
	cd $$repodir; git lfs fetch; cd - ;\
	mkdir -p $$reponame; rsync -rvz $$repodir/content/ $$reponame/ ;\
	cd .. ;\
	fl="$$(python3 -c "import json;import sys;print([x['file'] for x in json.load(open('site/settings.json'))['sections'] if sys.argv[1] in x['git']][0])" $$reponame)" ;\
	python3 merge_content.py content/$$reponame > site/src/assets/$$fl ;\
	rsync -rvz content/$$reponame site/src/assets/content/


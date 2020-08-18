all: website

DATAFILE := site/src/data.json

NG := node_modules/.bin/ng
NGOPTS := --prod --base-href https://ecal.gitlab.io/ecaldpgplots/ --deploy-url https://ecal.gitlab.io/ecaldpgplots/

$(DATAFILE): merge_content.py
	python merge_content.py content > $(DATAFILE)

website: $(DATAFILE)
	cd site; $(NG) build $(NGOPTS)
	cp -r content site/public/
clean:
	rm -f $(DATAFILE)